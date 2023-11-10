import { Router } from "express";
import _ from "better-sse";
const { createSession } = _;

import AUTH from "../../middlewares/authentication.js";
import { USERTYPE } from "../../utils/static.js";
import {
  InvalidUser,
  Unauthorized,
  NotFound,
  BadRequest,
  NoExecutive,
  UndeliveredMessage,
  Success,
  TicketAlreadyAccepted,
  InternalServerError,
  TicketExpired,
} from "../../utils/errors.js";
import { sendMessageByTicket } from "../../services/chat.js";
import {
  attachTicket,
  broadcastMultiple,
} from "../../services/channels/handleExecutive.js";
import { MESSAGE, TICKET, CHAT, EXECUTIVE } from "../../database/index.js";
const router = Router();
// const checkTicket= await checkTicketStatus({ticketID})
router.get("/", async (req, res) => {
  res.status(Success.status).json(Success);
});
router.post("/sendMessage", AUTH.message, async (req, res) => {
  // TODO: Need to update this function as per visitor and Authenticated user
  // TODO: Has to validate the ticketID and users associated with them.
  // TODO: Has to validate chatID and sender associated with that.
  const { senderID, receiverID, ticketID, chatID, message, user, type } =
    req.body;
  console.log("Body: ", req.body);
  if (type === "TICKET" && ticketID && senderID) {
    // TODO: Need to validate ticket here
    if(!global.TICKETS.has(ticketID)) return res.status(TicketExpired.status).json(TicketExpired)
    // TODO: Need to validate if the ID is associated with right type of user
    global.TICKETS.set(ticketID,{lastUpdated:Date.now()})
    const messageRes = await MESSAGE.generateMessage({
      senderID,
      ticketID,
      message,
      type,
    });
    const { messageID } = messageRes.data;
    if (!(messageID || messageRes.success)) {
      res.status(UndeliveredMessage.status).json(UndeliveredMessage);
      return;
    }
    const { success, ...Error } = await TICKET.addMessage({
      ticketID,
      messageID,
    });
    console.log("Message added to ticekt: ", success);
    if (!success) {
      res.status(UndeliveredMessage.status).json(UndeliveredMessage);
      return;
    }
    // TODO: Functionality to check if message sent or not
    sendMessageByTicket({
      ticketID,
      data: { message, messageID, senderID, receiverID },
    });

    res.status(Success.status).json({ Success });
  } else if (
    chatID &&
    (type === "GROUP" || type === "PRIVATE") &&
    user === "EXECUTIVE" &&
    senderID
  ) {
    // TODO: Need to check chatID existence
      const message = await MESSAGE.generateMessage({
        senderID,
        chatID,
        message,
        type,
      });
      console.log("message");
      const { messageID } = message.data;
      if (!(messageID || message.success)) {
        res.status(UndeliveredMessage.status).json(UndeliveredMessage);
        return;
      }
      const { success, data, ...Error } = CHAT.addMessage({
        chatID,
        messageID,
      })
      console.log("Message added to ticket: ", success);
      if (!success) {
        res.status(UndeliveredMessage.status).json(UndeliveredMessage);
        return;
      }
      // TODO: Functionality to check if message sent or not
      broadcastMultiple(
        data.users,
        { message, messageID, senderID, type },
        "CHAT"
      );

      res.status(Success.status).json({ Success });
  } else {
    res.status(BadRequest.status).json(BadRequest);
  }
});
router.post("/acceptChat", AUTH.user, async (req, res) => {
  const { ticketID, userID } = req.body;
  // #TODO: This function need to be improved to check if ticket exist of not.
  const ticketStatus = await TICKET.findTicket({ id: ticketID });
  if (ticketStatus?.data.isOpen || ticketStatus?.data.isClose) return res.status(TicketAlreadyAccepted.status).json(TicketAlreadyAccepted);
  // #TODO: Need to work over these functions to manage database updates for both TICKET and EXECUTIVE
  const ticketUpdate = await TICKET.acceptChat({ ticketID, userID });
  const executiveUpdate = await EXECUTIVE.acceptChat({ ticketID, userID });
  console.log(ticketUpdate, executiveUpdate);
  if (ticketUpdate.success && executiveUpdate.success) {
    attachTicket({ ticketID, userID });
    console.log("globals: ", global);
    res.status(200).json(ticketUpdate);
  } else res.status(BadRequest.status).json(BadRequest);
});
router.post("/startPrivateChat",AUTH.user, async (req, res) => {
  const { senderID, receiverID } = req.body;
  // TODO: To check if user exists
    // TODO: To check if already such Private Chat exists.
    // TODO: Has to send Chat ID in broadcast
    const chat = await CHAT.startPrivateChat({ senderID, receiverID });
    if (chat.success) {
      const { chatID } = chat.data;
      console.log("Adding chat to users...");
      const addChat = await EXECUTIVE.addChat({
        chatID,
        users: [senderID, receiverID],
      });
      if (addChat.success) {
        res.status(Success.status).json({ data: { chatID }, ...Success });
      } else res.status(InternalServerError.status).json(InternalServerError);
    } else res.status(InternalServerError.status).json(InternalServerError);
});
router.post("/createGroup",AUTH.user, async (req, res) => {
  const { userID, members, groupName, groupDescription } = req.body;
  // TODO: To check if all users exists
  // TODO: Has to send Chat ID in broadcast
    const chat = await CHAT.createGroupChat({
      creatorID: userID,
      users: [userID, ...members],
      groupName,
      groupDescription,
    });
    if (chat.success) {
      const { chatID } = chat.data;
      const addChat = await EXECUTIVE.addChat({
        chatID,
        users: [userID, ...members],
      });
      if (addChat.success) {
        res.status(Success.status).json({ data: { chatID }, ...Success });
      } else res.status(InternalServerError.status).json(InternalServerError);
    } else res.status(InternalServerError.status).json(InternalServerError);
});

export default router;
