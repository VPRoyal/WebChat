import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import Jwt from "jsonwebtoken";
import {config} from "dotenv"
config()

import { waitingAction } from "../../../services/waitingAction.js";
import { broadcastByID, broadcast } from "../../../services/channels/handleExecutive.js";
import { subscribe } from "../../../services/channels/handleVisitor.js";

import { BadRequest, InternalServerError, RequestTimeout } from "../../../utils/errors.js";
import {VISITOR, TICKET} from '../../../database/index.js'
const router = Router();
router.get("/", async (req, res) => {
  let { ticketID, visitorID, ...data } = req.query;
  // TODO: Has to validate the incoming data
  // TODO: Has to check if data is there
  if (visitorID && ticketID) {
    // He will be a old person
    // TODO: Implement user Identification
    // TODO: Implement Ticket Expiration check
  } else if (!(visitorID || ticketID)) {
    // He is a new person
    const Visitor=await VISITOR.generateVisitor({name:data.name,email:data.email, phone:data.phone })
    if(!(Visitor?.success)) return res.status(InternalServerError.status).json(InternalServerError).end()
    visitorID=Visitor.data.visitorID
    // TODO: Check if executive available
    // TODO: Generate Ticket if executive avaialable
    // TODO: ADD Ticket in permanent database as well as in temp Database for fast access.
    const Ticket= await TICKET.generateTicket({visitorID})
    if(!(Ticket?.success)) return res.status(BadRequest.status).json(BadRequest).end()
    ticketID=Ticket.data.ticketID
    VISITOR.addTicket({ticketID, visitorID})
    global.TICKETS.set(ticketID, {status:"active", visitorID, executiveID:null, lastUpdated: Ticket.data.lastUpdated})
    const session = await createSession(req, res)
    // TODO: Function to generate visitor data object
    session.state={visitorID, ticketID}
    subscribe(session)
    // ------------->>>>>> Notifying available executive for visitors
    // TODO: Send visitor details too (Optional)
    broadcast({ visitorID, ticketID, type: "request", name:data.name, email:data.email }, "visitor");

    // ------------->>>>>> Waiting for executive to respond
    // TODO: Check in fast database for ticket action
    const action = await waitingAction({ ticketID, visitorID });
    // var action={}
    // action.success=true
    if (action?.success) {
        action.type="details"
        console.log({actionData: action})
      broadcastByID(action.data.executiveID, action, "visitor");
      console.log("Ticket: ", global.TICKETS.get(ticketID))
      global.TICKETS.set(ticketID,{executiveID:action.data.executiveID,lastUpdated:Date.now()})
      

      // TODO: Details of executive and ticket has to be send here
      // TODO: Need to generate token here then I have to send it in the data below
      const token =Jwt.sign({tempID: visitorID}, process.env.JWT_VISITOR_KEY, { expiresIn: 1*60*60 })
      data={...data, ticketID, visitorID, userID: action.data.executiveID, token}
      session.push({message:"You are connected", data, type:"details"}, "user")
    } else {session.push(RequestTimeout, "close"); res.end()}
  }
  else{return res.status(BadRequest.status).json(BadRequest).end()}
});

export default router;
