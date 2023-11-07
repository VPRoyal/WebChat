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
const checkVisistor=({visitorID})=>{
    visitorPool.sessions.forEach(item => {
        if(item.state.visitorID===visitorID) return true
    })
    return false
}

export {subscribe, broadcast, checkVisistor}