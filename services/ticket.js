import { addData, addDataByField, findData, updateDataByField } from "../test/dataOps.js"
const generateTicket= (data)=>{
    const uniqueID =`TICKET${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`
    const ticketObj={
        id:uniqueID,
        visitorID: data.visitorID,
        created_at:Date.now(),
        lastUpdated:Date.now(),
        isOpen:false,
        isClose: false,
        executiveID: null,
        messageID:[]
    }
    try {
        const res= addData({databaseName:"TICKET", data:ticketObj})
        console.log("TICKET GENERATED: ", res.id)
        return {success:true, data:{ticketID:res.id, lastUpdated:ticketObj.lastUpdated}}
    } catch (err) {
        console.log("error: ", err)
        return {success:false, message:"Error generating ticket", error: err}
    }
}

//Pending
const addMessageToTicket= ({ticketID,messageID})=>{
    try {
        const postData={databaseName:"TICKET", fieldToFind:"id", fieldValue:ticketID, fieldToAdd:"messageID", newValue:messageID}
        const {success, error, message}=addDataByField(postData)
        console.log("ADD MESSAGE TO TICKET, ",success, error, message)
        if (success) return {success, message:"Message added successfully"}
        return {success, error, message}
    } catch (err) {
        console.log("error: ", err.error)
        return {success:false, error:err, message: "Error adding message"}
    }
}
const checkTicketStatus = async ({ticketID})=>{
    try {
        console.log("axiosPost")
        const res = findData({databaseName: "TICKET",field: "id",value: ticketID});
        if (res.success){
            return {success:true, isClose:res.data.isClose, isOpen:res.data.isOpen}
        }
        return {success:false,error:"No Ticket found", message:"No Ticket found"}
      } catch (err) {
        return {success:false,error:err, message:"There is an error checking ticket status"}
      }
}
const closeTicket =({ticketID})=>{
    try {
        global.TICKET.delete(ticketID)
        return updateDataByField({databaseName: "TICKET",fieldToFind: "id",fieldValue: ticketID,fieldToUpdate: "isClose",newValue:true});
    } catch (error) {
        return {success:false,error:err, message:"There is an error closing ticket"}
    }
}
export {generateTicket, addMessageToTicket, checkTicketStatus, closeTicket}