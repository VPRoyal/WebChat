import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import { waitingAction } from "../../../services/waitingAction.js";
import { broadcastByID, broadcast } from "../../../services/channels/handleExecutive.js";
import { subscribe } from "../../../services/channels/handleVisitor.js";

import { BadRequest, InternalServerError, RequestTimeout } from "../../../utils/errors.js";
import { generateTicket } from "../../../services/ticket.js";
import { addTickettoData, addVisitor } from "../../../services/visitor.js";
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
    const Visitor=addVisitor({name:data.name,email:data.email, phone:data.phone })
    if(!(Visitor?.success)) res.status(InternalServerError.status).json(InternalServerError)
    visitorID=Visitor.data.visitorID
    // TODO: Check if executive available
    // TODO: Generate Ticket if executive avaialable
    // TODO: ADD Ticket in permanent database as well as in temp Database for fast access.
    const Ticket= generateTicket({visitorID})
    if(!(Ticket?.success)) {
      res.status(BadRequest.status).json(BadRequest)
      return
    }
    ticketID=Ticket.data.ticketID
    addTickettoData({ticketID, visitorID})
    // ------------->>>>>> Notifying available executive for visitors
    // TODO: Send visitor details too (Optional)
    broadcast({ visitorID, ticketID, type: "request", name:data.name, email:data.email }, "visitor");

    // ------------->>>>>> Waiting for executive to respond
    // TODO: Check in fast database for ticket action
    const action = await waitingAction({ ticketID });
    // var action={}
    // action.success=true
    if (action?.success) {
        action.type="details"
      broadcastByID(action.data.executiveID, action, "visitor");
      global.TICKETS.set(ticketID, {status:"active", visitorID, executiveID:action.data.executiveID, lastUpdated: Ticket.data.lastUpdated})
      const session = await createSession(req, res)
      // TODO: Function to generate visitor data object
      session.state={visitorID, ticketID}
      subscribe(session)

      // TODO: Details of executive and ticket has to be send here
      // TODO: Need to generate token here then I have to send it in the data below
      data={...data, ticketID, visitorID, userID: action.data.executiveID, token:"SARV_AUTHENTICATION"}
      session.push({message:"You are connected", data, type:"details"}, "user")
    } else res.status(RequestTimeout.status).json(RequestTimeout);
  }
  else{res.status(BadRequest.status).json(BadRequest)}
});

export default router;
