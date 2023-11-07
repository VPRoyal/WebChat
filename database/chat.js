import { mongoInstance } from "./db.js";
// #TODO: Has to add some constraints to this chat objects
// #TODO: Has to try to submerged these functions into one
let privateChatObj = function privateChatObject(senderID, receiverID) {
  (this.id = `PCHAT${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`),
    (this.type = "PRIVATE"),
    (this.createdAt = Date.now()),
    (this.creator = senderID),
    (this.users = [senderID, receiverID]),
    (this.maxUser = 2),
    (this.isActive = true),
    (this.messages=[]),
    (this.deletedAt=null)
};
let groupChatObj= function groupChatObject(groupName,groupDescription, creatorID, users){
  (this.id = `GCHAT${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`),
  (this.type = "GROUP"),
  (this.subject=groupName),
  (this.description=groupDescription)
  (this.createdAt = Date.now()),
  (this.creator = creatorID),
  (this.users = [creatorID, ...users]),
  (this.maxUser = 20),
  (this.isActive = true),
  (this.messages=[]),
  (this.deletedAt=null)
}
export default class Chat {
  constructor() {
    this.collectionName = "chat";
    this.db = mongoInstance.collection(this.collectionName);
  }
  addMessage= async ({ChatID, messageID})=>{
    try {
      const filter={ id: ChatID }
      const update={$push:{messages:messageID}}
      const res= await this.db.findOneAndUpdate(filter, update,{ returnOriginal: false })
      if(res?.value) return {success:true, data:res.value, message:"Message successfully added to the Chat"}
      throw new Error("Doc not found")
  } catch (error) {
      return {success:false, message: "Error adding message", error}
  }
  }
  findChat= async({id})=>{
    try {
      const res= await this.db.findOne({id})
      if (res) return { success: true, data: res };
      throw new Error("No Ticket Found")
    } catch (error) {
      return { success: false, message: "Error fetching ticket", error}
    }
  }
  startPrivateChat=async ({senderID, receiverID})=>{
    try {
      const chat = new privateChatObj(senderID, receiverID);
      const res = await this.db.insertOne(chat);
      if(res?.insertedId) return { success: true, data: { chatID: chat.id } }
      throw new Error("Doc not inserted")
    } catch (error) {
        return { success: false, message: "Error starting private chat", error}
    }
  }
  createGroupChat=async({ creatorID, users, groupName, groupDescription })=>{
    try {
      const chat = new groupChatObj(creatorID, users, groupName, groupDescription);
      const res = await this.db.insertOne(chat);
      if(res?.insertedId) return { success: true, data: { chatID: chat.id } }
      throw new Error("Doc not inserted")
    } catch (error) {
        return { success: false, message: "Error starting group chat", error}
    }
  }
}
