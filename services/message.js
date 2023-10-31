import { addData } from "../test/dataOps.js"
// TODO: Have to categorize message on the basis of private, group and ticket
const generateMessage= (data)=>{
    const {senderID, ticketID, chatID, message, type}=data
    // Need to add validations
    const messageID =`MESSAGE${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`
    const messageObj={
        id:messageID,
        senderID,
        created_at:Date.now(),
        message,
        type
    }
    if(ticketID&&type==="TICKET"){
        messageObj.ticketID=ticketID
    }else messageObj.chatID=chatID
    try {
        const res= addData({databaseName:"MESSAGE", data:messageObj})
        console.log("success: ", res)
        return {messageID:res.id, ...res}
    } catch (err) {
        return {success:false, message:"There is an error generating message", error:err.error}
    }
}

export {generateMessage}