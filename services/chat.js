import { executivePool, visitorPool } from "./channels/channels.js"
import { addDataByField, updateDataByField } from "../test/dataOps.js"
import { addData } from "../test/dataOps.js"

const acceptChat = async (ticketID, executiveID) => {
  const ticketData = {
    databaseName: "TICKET",
    fieldToFind: "id",
    fieldValue: ticketID,
    fieldToUpdate: ["isOpen", "executiveID"],
    newValue: [true, executiveID],
  };
  let userData={
    databaseName: "EXECUTIVE",
    fieldToFind: "id",
    fieldValue: executiveID,
    fieldToAdd: "active_ticket",
    newValue: ticketID,ticketID,
  }
  try {
    addDataByField(userData)
    updateDataByField(ticketData)
    return {success: true, message:"Data Updated"}
  } catch (err) {
    return {
      success: false,
      message: "Error accepting chat",
      error: err,
    };
  }
};
const sendMessageByTicket = ({ ticketID, data }) => {
  executivePool.sessions.forEach((item) => {
    const { state } = item;
    if (state.activeTickets.includes(ticketID)) {
      item.push({ ticketID, data, type: "chat" }, "visitor");
    }
  });
  visitorPool.sessions.forEach((item) => {
    const { state } = item;
    console.log("Visitor st: ",state)
    if (state.ticketID === ticketID) {
      item.push({ ticketID, data, type: "chat" }, "visitor");
    }
  });
};

const generatePrivateChat = ({ senderID, receiverID }) => {
  // TODO: Implement standard object creation
  const uniqueID = `PCHAT${Date.now().toString().slice(-10)}${Math.random()
    .toString()
    .slice(2, 12)}`;
  let chatObj = {
    id: uniqueID,
    type: "PRIVATE",
    created_at: Date.now(),
    creator: senderID,
    users: [senderID, receiverID],
    maxUser: 2,
    messages: [],
    isActive: true,
    deleted_at: null,
  };
  try {
    const res = addData({ databaseName: "CHAT", data: chatObj });
    console.log("success: ", res);
    return { success: true, data: { chatID: res.id } };
  } catch (err) {
    console.log("error: ", err);
    return { success: false, message: "Error generating ticket", error: err };
  }
};

const generateGroupChat = ({ creatorID, users, groupName, groupDescription }) => {
  // TODO: Implement standard object creation
  // TODO: To check if users are more than required limit or not.
  const uniqueID = `GCHAT${Date.now().toString().slice(-10)}${Math.random()
    .toString()
    .slice(2, 12)}`;
  let chatObj = {
    id: uniqueID,
    type: "GROUP",
    subject:groupName,
    description:groupDescription,
    created_at: Date.now(),
    creator: creatorID,
    users: [creatorID, ...users],
    maxUser: 20,
    messages: [],
    isActive: true,
    deleted_at: null,
  };
  try {
    const res = addData({ databaseName: "CHAT", data: chatObj });
    console.log("success: ", res);
    return { success: true, data: { chatID: res.id } };
  } catch (err) {
    console.log("error: ", err.error);
    return { success: false, message: "Error generating ticket", error: err };
  }
};

const addChatToUsers = ({ chatID, users }) => {
  // TODO: Function need to improved
  let res;
  users.forEach((id) => {
    res = addDataByField({databaseName: "EXECUTIVE",fieldToFind: "id",fieldValue: id,fieldToAdd: "chats",newValue: chatID,});
    if (!res.success) return res;
  });
  return res;
}

const addMessageToChat=({chatID, messageID})=>{
  try {
    const postData={databaseName:"CHAT", fieldToFind:"id", fieldValue:chatID, fieldToAdd:"messages", newValue:messageID}
    const res=addDataByField(postData)
    // console.log("ADD MESSAGE TO CHAT, ",res.success, res.error, res.message)
    if (res.success) return {success:res.success, message:"Message added successfully", data:res.data}
    return res
} catch (err) {
    console.log("error: ", err)
    return {success:false, error:err, message: "Error adding message"}
}
}
export {
  acceptChat,
  sendMessageByTicket,
  generatePrivateChat,
  generateGroupChat,
  addChatToUsers,
  addMessageToChat
};
