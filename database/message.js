import { mongoInstance } from "./db.js";
// #TODO: Need to improve the messageObj and generate function to recognise as ticketID and chatID
let messageObj = function MessageObject({senderID, ticketID, type, chatID, message}) {
  (this.id = `MESSAGE${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`),
    (this.senderID = senderID),
    (this.createdAt = Date.now()),
    (this.message=message),
    (this.type=type)
    if(ticketID&&type==="TICKET"){
      this.ticketID=ticketID
  }else this.chatID=chatID
};
export default class Message {
  constructor() {
    this.collectionName = "message";
    this.db = mongoInstance.collection(this.collectionName);
  }
  // TODO: Have to categorize message on the basis of private, group and ticket
   // TODO: Need to add validations
  generateMessage=async(data)=>{
    const {senderID, ticketID, type, chatID, message}=data
    try {
      if(!(ticketID||chatID)) throw new Error("ticketID and chatID both are not present")
      const Obj = new messageObj({senderID, ticketID, type, chatID, message});
      const res = await this.db.insertOne(Obj);
      if(res?.insertedId) return {success:true, data:{messageID:Obj.id, ...Obj}}
      throw new Error("Doc not inserted")
    } catch (error) {
        return { success: false, message: "Error generating message", error}
    }
  }
}
