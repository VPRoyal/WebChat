import { Router } from "express";
import _ from "better-sse"
const {createSession}= _

import { authenticate } from "../../services/authentication.js";
import { USERTYPE } from "../../utils/static.js";
import { InvalidUser, Unauthorized, NotFound, BadRequest, NoExecutive, UndeliveredMessage, Success, TicketAlreadyAccepted, InternalServerError } from "../../utils/errors.js";
import { generateMessage } from "../../services/message.js";
import { addMessageToTicket, checkTicketStatus } from "../../services/ticket.js";
import { acceptChat, addChatToUsers, addMessageToChat, generateGroupChat, generatePrivateChat } from "../../services/chat.js";
import { sendMessageByTicket } from "../../services/chat.js"; 
import { attachTicket, broadcastMultiple } from "../../services/channels/handleExecutive.js";
const router = Router();
// const checkTicket= await checkTicketStatus({ticketID})
router.get("/", async (req, res)=>{
    res.status(Success.status).json(Success)
})
router.post("/sendMessage", async(req, res)=>{
    // TODO: Need to update this function as per visitor and Authenticated user
    // TODO: Has to validate the ticketID and users associated with them.
    // TODO: Has to validate chatID and sender associated with that.
    const {senderID, receiverID, ticketID, chatID, token, message, user, type}= req.body
    const isAuthentic = authenticate(token)
    console.log("Body: ", req.body)
    if(type==="TICKET"&&ticketID&&senderID){
        // TODO: Need to validate ticket here
        // TODO: Need to validate if the ID is associated with right type of user
        const {messageID, ...ErrorMessage}= generateMessage({senderID, ticketID, message, type})
            console.log("message")
            if(!messageID){
                res.status(UndeliveredMessage.status).json(UndeliveredMessage)
                return
            }
            const {success, ...Error} =addMessageToTicket({ticketID,messageID})
            console.log("Message added to ticekt: ", success)
            if(!success){
                res.status(UndeliveredMessage.status).json(UndeliveredMessage)
                return
            }
            // TODO: Functionality to check if message sent or not
            sendMessageByTicket({ticketID, data:{message,messageID, senderID, receiverID}})
            
            res.status(Success.status).json({Success})
    }
    else if(chatID&&(type==="GROUP"||type==="PRIVATE")&&user==="EXECUTIVE"&&senderID){
        // TODO: Need to check chatID existence 
        if (isAuthentic){
            const {messageID, ...ErrorMessage}= generateMessage({senderID, chatID, message, type})
            console.log("message")
            if(!messageID){
                res.status(UndeliveredMessage.status).json(UndeliveredMessage)
                return
            }
            const {success,data, ...Error} =addMessageToChat({chatID,messageID})
            console.log("Message added to ticekt: ", success)
            if(!success){
                res.status(UndeliveredMessage.status).json(UndeliveredMessage)
                return
            }
            // TODO: Functionality to check if message sent or not
            broadcastMultiple(data.users, {message,messageID, senderID, type}, "CHAT")
            
            res.status(Success.status).json({Success})

        }else {
            res.status(Unauthorized.status).json(Unauthorized);
        }
    }else{
        res.status(BadRequest.status).json(BadRequest)
    }

})
router.post("/acceptChat", async (req, res) => {
    const { ticketID, userID, token } = req.body;
    const isAuthentic = authenticate(token);
    if (isAuthentic) {
        const ticketStatus= await checkTicketStatus({ticketID})
        if(ticketStatus?.isOpen || ticketStatus?.isClose){
            res.status(TicketAlreadyAccepted.status).json(TicketAlreadyAccepted)
            return
        }
      const {success, error, message}=await acceptChat(ticketID, userID)
      if (success) {
        attachTicket({ticketID, userID})
        console.log("globals: ", global)
        res.status(200).json({success, message})
    }
      else res.status(BadRequest.status).json(BadRequest)
    } else {
      res.status(Unauthorized.status).json(Unauthorized);
    }
});
router.post("/startPrivateChat", async(req, res)=>{
    const {senderID, receiverID, token}= req.body
    // TODO: To check if user exists
    const isAuthentic = authenticate(token)
    if(isAuthentic){
        // TODO: To check if already such Private Chat exists.
        // TODO: Has to send Chat ID in broadcast
        const chat= generatePrivateChat({senderID, receiverID})
        if (chat.success){
            const {chatID}=chat.data
            console.log("Adding chat to users...")
            const addChat=addChatToUsers({chatID, users:[senderID, receiverID]})
            if(addChat.success) {

                res.status(Success.status).json({data:{chatID},...Success})
            }
            else res.status(InternalServerError.status).json(InternalServerError)
        }else res.status(InternalServerError.status).json(InternalServerError)
    }else res.status(Unauthorized.status).json(Unauthorized)
})
router.post("/createGroup", async(req, res)=>{
    const {userID, members, groupName, groupDescription, token}= req.body
    // TODO: To check if all users exists
    // TODO: Has to send Chat ID in broadcast
    const isAuthentic = authenticate(token)
    if(isAuthentic){
        const chat= generateGroupChat({creatorID:userID, users:[userID, ...members], groupName, groupDescription})
        if (chat.success){
            const {chatID}=chat.data
            const addChat=addChatToUsers({chatID, users:[userID, ...members]})
            if(addChat.success) {
                
                res.status(Success.status).json({data:{chatID},...Success})
            }
            else res.status(InternalServerError.status).json(InternalServerError)
        }else res.status(InternalServerError.status).json(InternalServerError)
    }else res.status(Unauthorized.status).json(Unauthorized)
})

export default router