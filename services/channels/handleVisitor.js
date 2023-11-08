import { visitorPool } from "./channels.js";

const subscribe= (session)=>{
    visitorPool.register(session)
    console.log(`session Connected: ${session.state.visitorID}`)
    // session.req.on('close', ()=>{
    //     console.log("Session disconnected: ", session.userData.id)
    // })
    // session.req.on('close', disconnected)
    // console.log("Connected Sessions event: ", session._events)
    visitorPool.sessions.forEach(item => {
        // console.log(item.userData.id)
        console.log(`sessions: ${item.state.visitorID}, state: ${item.isConnected}`)
    })
}
const broadcast= (message, event)=>{
    visitorPool.broadcast(message, event)
}
const checkVisitor=({visitorID})=>{
    let bool=false
    visitorPool.sessions.forEach(item => {
        if(item.state.visitorID===visitorID) return bool=true
    })
    return bool
}

// Event Listeners---->>>.
const register=(session)=>{
    console.log("Session registered: ", session.state)
}
const unregister=(session)=>{
    console.log("Session deregistered: ", session.state)
}
const disconnected=(session)=>{
    console.log("Session disconnected: ", session.state)
}
visitorPool
    .on("session-registered", register)
	.on("session-deregistered", unregister)
    .on("session-disconnected", disconnected)

export {subscribe, broadcast, checkVisitor}