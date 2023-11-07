import { mongoInstance } from "./db.js";
export default class Executive {
  constructor() {
    this.collectionName = "executive";
    this.db = mongoInstance.collection(this.collectionName);
  }
  findUser = async ({ email }) => {
    try {
      const res = await this.db.findOne({ email });
      if (res) return { success: true, data: res };
      return { success: false, data: null };
    } catch (error) {
      return { success: false, message: "Error fetching executive", error };
    }
  };
  acceptChat = async ( {ticketID, userID} ) => {
    // #TODO: Need to be update ExecutiveID as array. To accumulate multiple executives.
    try {
      const filter = { id: userID };
      const updatingField = { $set: { active_ticket: ticketID, tickets:ticketID } };
      const res = await this.db.updateOne(filter, updatingField);
      if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Fields updated successfully."};
    } catch (error) {
      return { success: false, message: "Error updating fields", error };
    }
  };
  addChat = async ({ chatID, users }) => {
    try {
      const filters = users.map((id) => ({ id }));
      const filter = { $or: filters };
      const update = { $push: { chats: chatID } };
      const res = await this.db.updateOne(filter, update);
      if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Fields updated successfully."};
    } catch (error) {
      return { success: false, message: "Error updating fields", error };
    }
  };
  updateStatus = async ({ id, status }) => {
    console.log("Update Status: ", id, status)
    try {
      const update = { $set: { online: status } };
      const res = await this.db.updateOne({ id }, update);
      if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Fields updated successfully."}
    } catch (error) {
      console.log("Error updating executive: ", error);
      return { success: false, message: "Error updating fields", error };
    }
  };
  closeTicket= async({ticketID, userID})=>{
      try{
        const filter = { id: userID };
        const update = { $pull: { active_ticket: ticketID } };
        const res = await this.db.updateOne(filter, update);
        if (!res.matchedCount) throw new Error("Doc not found")
      return {success: true,message: "Fields updated successfully."}
    } catch (error) {
      console.log("Error updating executive: ", error);
      return { success: false, message: "Error updating fields", error };
    }
  }
}
