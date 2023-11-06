// DELETE IT
import { addData, updateDataByField } from "../test/dataOps.js";
// const addVisitor = ({ name, email, phone }) => {
//   const id = `VISITOR${Date.now().toString().slice(-10)}${Math.random()
//     .toString()
//     .slice(2, 12)}`;
//   const visitorObj = {
//     id,
//     name,
//     email,
//     phone,
//     created_at: Date.now(),
//     activeTicket: null,
//     tickets: [],
//   };
//   try {
//     const res = addData({ databaseName: "VISITOR", data: visitorObj });
//     console.log("success: ", res);
//     return { success: true, data: { visitorID: res.id } };
//   } catch (err) {
//     console.log("error: ", err);
//     return { success: false, message: "Error generating ticket", error: err };
//   }
// };
// const addTickettoData = ({ ticketID, visitorID }) => {
//   let userData = {
//     databaseName: "VISITOR",
//     fieldToFind: "id",
//     fieldValue: visitorID,
//     fieldToAdd: "activeTicket",
//     newValue: ticketID,
//   };
//   try {
//     updateDataByField(userData);
//     return { success: true, message:"Ticket added" };
//   } catch (err) {
//     return {
//       success: false,
//       message: "Error accepting chat",
//       error: err,
//     };
//   }
// };
export { addVisitor, addTickettoData };
