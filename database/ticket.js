import { mongoInstance } from "./db.js";
let ticketObj = function TicketObject(visitorID) {
  (this.id = `TICKET${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`),
    (this.visitorID = visitorID),
    (this.createdAt = Date.now()),
    (this.closedAt=null),
    (this.lastUpdated = Date.now()),
    (this.isOpen = false),
    (this.isClose = false),
    (this.executiveID = null);
    (this.messages=[])
};
export default  class Ticket {
  constructor() {
    this.collectionName = "ticket";
    this.db = mongoInstance.collection(this.collectionName);
    
  }
  generateTicket=async({visitorID})=>{
    try {
      const ticket = new ticketObj(visitorID);
      const res = await this.db.insertOne(ticket);
      if(res?.insertedId) return {success:true, data:{ticketID:ticket.id, lastUpdated:ticket.lastUpdated}}
      throw new Error("Doc not inserted")
    } catch (error) {
        return { success: false, message: "Error generating visitor", error}
    }
  }
  findTicket= async({id})=>{
    try {
      const res= await this.db.findOne({id})
      if (res) return { success: true, data: res };
      throw new Error("No Ticket Found")
    } catch (error) {
      return { success: false, message: "Error fetching ticket", error}
    }
  }
  addMessage= async ({ticketID, messageID})=>{
    try {
      const filter={ id: ticketID }
      const update={$set: {lastUpdated: Date.now(),messages: {$each: [messageID],$position: 0}}}
      const res= await this.db.updateOne(filter, update)
      if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Message added to the ticket."};
  } catch (error) {
      return {success:false, message: "Error adding message", error}
  }
  }
  acceptChat=async ({ticketID, executiveID})=>{
    // #TODO: Need to be update ExecutiveID as array. To accumulate multiple executives.
      try {
        const filter={ id: ticketID }
        const updatingField={$set:{isOpen:true,executiveID, lastUpdated:new Date()}}
        const res= await this.db.updateOne(filter, updatingField)
        if (!res.matchedCount) throw new Error("Doc not found")
        return {success: true,message: "Fields are updated."};

      } catch (error) {
        return {success:false, message: "Error adding message", error}
      }
  }
  closeTicket=async ({id})=>{
    try {
      const update= {$set:{isClose:false, closedAt:new Date()}}
      const res= await this.db.updateOne({id}, update)
      if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Fields are updated."};

    } catch (error) {
      return {success:false, message: "Error updating ticket", error}
    }
  }
}
