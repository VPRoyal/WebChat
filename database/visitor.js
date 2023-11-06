import { mongoInstance } from "./db.js";
let visitorObj = function VisitorObject(name, email, phone) {
  (this.id = `VISITOR${Date.now().toString().slice(-10)}${Math.random().toString().slice(2, 12)}`),
    (this.name = name),
    (this.email = email),
    (this.phone = phone),
    (this.createdAt = Date.now()),
    (this.activeTicket = null),
    (this.tickets = []);
};
export default class Visitor {
  constructor() {
    this.collectionName = "visitor";

    this.db = mongoInstance.collection(this.collectionName);
  }
  generateVisitor = async ({ name, email, phone }) => {
    try {
      const visitor = new visitorObj(name, email, phone);
      const res = await this.db.insertOne(visitor);
      if(res?.insertedId) return { success: true, data: { visitorID: visitor.id } }
      throw new Error("Doc not inserted")
    } catch (error) {
        return { success: false, message: "Error generating visitor", error}
    }
  };
  addTicket= async ({ticketID, visitorID})=>{
    try {
      const filter={ id: visitorID }
      const update={$push:{activeTicket:ticketID}}
      const res= await this.db.updateOne(filter, update)
      if (!res.matchedCount) throw new Error("Doc not found")
      return { success: true, message:"Ticket added" }
    } catch (error) {
      return {success: false,message: "Error adding Ticket",error}
    }
  }
}

