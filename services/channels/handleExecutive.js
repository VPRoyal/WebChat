import { executivePool } from "./channels.js";
import {EXECUTIVE} from "../../database/index.js"
const checkState=()=>{
    executivePool.sessions.forEach(item=>{
        console.log(`session: ${item.userData.id}, state: ${item.isConnected}`)
    })
}

const subscribe= (session,)=>{
    executivePool.register(session)
    console.log(`session Connected: ${session.state.userID}`)
}
const broadcast= (message, event)=>executivePool.broadcast(message, event)

const broadcastByID=(id, message,event)=>{
    executivePool.sessions.forEach(item => {
        if (item.state.userID===id) {
            item.push(message,event)
            return
        }
        else console.log("Executive gone offline")
    });

}
const broadcastMultiple=(users, message, event)=>{
    executivePool.sessions.forEach(item => {
        if (users.includes(item.state.userID)) {
            item.push(message,event)
            // console.log("Sent User Message to: ",item.userData.id)
            return
        }
        else console.log(`Executive : ${item.state.userID} gone offline`)
    });
}
const sessionCount=()=>{
    return executivePool.sessions.size
}
const attachTicket=({userID, ticketID})=>{
    executivePool.sessions.forEach(item => {
        if(item.state.userID===userID) item.state.activeTickets.push(ticketID)
    })
}


// Listener functions
const register =(session)=>{
 console.log("Active sessions: ",executivePool.sessionCount)
 console.log("Executive Registered: ",session.state.userID)
 broadcast(`Total Executive online: ${sessionCount()}`,"broadcast");
 EXECUTIVE.updateStatus({id:session.state.userID, status:true})
}
const unregister =(session)=>{
    // console.log("unregister sessions: ",executivePool.sessionCount)
    console.log("Executive disregistered: ",session.state.userID)
    console.log("Session Count: ", sessionCount())

}
const disconnected =(session)=>{
    console.log("dissconnected ID: ", session.state.userID)
    // Updated Executive database
    EXECUTIVE.updateStatus({id:session.state.userID, status:false})
    // TODO: Move Ticket from active_tickets to ticket in executive database
    // TODO: Update ticket status as remove executive id from TICKET global variable
    // TODO: Has to update ticket database as to 

    // broadcast(`Total Executive online: ${sessionCount()}`,"broadcast")
}

// Event Listeners
executivePool
    .on("session-registered", register)
	.on("session-deregistered", unregister)
    .on("session-disconnected", disconnected)

export {subscribe, broadcast, broadcastByID, sessionCount, attachTicket, broadcastMultiple}