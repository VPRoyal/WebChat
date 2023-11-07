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
  if (visitorID && ticketID) {
    // He will be a old person
    // TODO: Implement user Identification
    // TODO: Implement Ticket Expiration check
  } else if (!(visitorID || ticketID)) {
    // He is a new person
    const Visitor=await VISITOR.generateVisitor({name:data.name,email:data.email, phone:data.phone })
    console.log("VISITOR: ", Visitor)
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
      broadcastByID(action.data.executiveID, action, "visitor");
      global.TICKETS[ticketID].executiveID=action.data.executiveID
      global.TICKETS[ticketID].lastUpdated=Date.now()
      const session = await createSession(req, res)
      // TODO: Function to generate visitor data object
      session.state={visitorID, ticketID}
      subscribe(session)

      // TODO: Details of executive and ticket has to be send here
      // TODO: Need to generate token here then I have to send it in the data below
      const token =Jwt.sign({tempID: visitorID}, process.env.JWT_SECRET_KEY.VISITOR, { expiresIn: 24*60*60 })
      data={...data, ticketID, visitorID, userID: action.data.executiveID, token}
      session.push({message:"You are connected", data, type:"details"}, "user")
    } else res.status(RequestTimeout.status).json(RequestTimeout);
  }
  else{res.status(BadRequest.status).json(BadRequest)}
});

export default router;
