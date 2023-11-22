import Jwt from "jsonwebtoken";
import { InternalServerError, InvalidParameters, Unauthorized } from "../utils/errors.js";
import { CHAT, TICKET } from "../database/index.js";
import {config} from "dotenv"
config()
class Authenticate{
    // #TODO: Has to implement token fetch from headers, not from request body.
    // #TODO: Has to implement token expiry check from global variables and to implement token expiry mechnaism on logout.
    constructor(){
        this.keys={VISITOR:process.env.JWT_VISITOR_KEY, USER: process.env.JWT_USER_KEY}
    }
    jwtVerify=(token, key)=>{
        console.log({key})
        try {
            const data= Jwt.verify(token, key)
            return {success:true, data}
        } catch (error) {
            return {success:false, error}
        }
    }
    user= async(req, res, next)=>{
        // #TODO: Has to check if token expired or not.
        const token=req.body?.token || req.query?.token
        const userID=req.body?.userID || req.query?.userID
        const JWT=this.jwtVerify(token, this.keys.USER)
        if(JWT.success&&JWT.data?.tempID===userID) next()
        else return res.status(Unauthorized.status).json(Unauthorized)
    }
    message= async(req, res, next)=>{
        const {user, type, ticketID, chatID, senderID, receiverID}=req.body
        const token=req.body?.token || req.query?.token
        if(!token) return res.status(InvalidParameters.status).json(InvalidParameters)
        let executive, visitor, keys
        if(user==="VISITOR"){
            keys=this.keys.VISITOR
            visitor=senderID,
            executive=receiverID
        }else if(user==="EXECUTIVE"){
            keys= this.keys.USER
            visitor=receiverID
            executive=senderID
        }else return res.status(InvalidParameters.status).json(InvalidParameters)
        console.log({keys, visitor, executive})
        const JWT=this.jwtVerify(token, keys)
        console.log({JWT})
        if(JWT.success){
            if(type=="TICKET" &&ticketID){
                const ticket=await TICKET.findTicket({id:ticketID})
                console.log({ticket})
                if(!ticket.success) return res.status(InternalServerError.status).json(InternalServerError)
                if(!(ticket.data.visitorID===visitor && ticket.data.executiveID===executive && JWT?.data?.tempID===senderID && ticket.data.isOpen && !ticket.data.isClose)) return res.status(Unauthorized.status).json(Unauthorized)
                next()
            }else if((type=="PRIVATE" || type=="GROUP")&&chatID){
                // #TODO: We can also check for access to various group members through this.
                const chat=await CHAT.findChat({id: chatID})
                if(!(chat.includes(senderID)&&JWT?.data?.tempID===senderID)) return res.status(Unauthorized.status).json(Unauthorized)
                next()
            }else return res.status(InvalidParameters).json(InvalidParameters)
        }
        else return res.status(Unauthorized.status).json(Unauthorized)
    }
    // visitor= async(req, res,next)=>{
    //     const token=req.body?.token || req.query?.token
    //     const JWT=this.jwtVerify(token, this.keys.USER)
    // }
}
const AUTH= new Authenticate()
export default AUTH