import Jwt from "jsonwebtoken";
import { InternalServerError, InvalidParameters, Unauthorized } from "../utils/errors.js";
import { CHAT, TICKET } from "../database/index.js";
import {config} from "dotenv"
config()
class Authenticate{
    // #TODO: Has to implement toke fetch from headers, not from request body.
    // #TODO: Has to implement token check from global variables
    constructor(){
        this.keys=process.env.JWT_SECRET_KEY
    }
    jwtVerify=async(token, key)=>{
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
        const JWT=this.jwtVerify(token, this.keys.USER)
        if(JWT.success&&JWT.data?.tempID) next()
        else return res.status(Unauthorized.status).json(Unauthorized)
    }
    message= async(req, res, next)=>{
        const {user, type, ticketID, chatID, senderID, receiverID}=req.body
        const token=req.body?.token || req.query?.token
        let executive, visitor, keys
        if(user==="VISITOR"){
            keys=this.keys.VISITOR
            visitor=senderID,
            executive=receiverID
        }else if(user==="EXECUTIVE"){
            keys= this.keys.USER
            visitor=receiverID
            executive=this.senderID
        }else return res.status(InvalidParameters.status).json(InvalidParameters)
        const JWT=this.jwtVerify(token, keys)
        if(JWT.success){
            if(type=="TICKET" &&ticketID){
                const ticket=await TICKET.findTicket({id:ticketID})
                if(!ticket.success) return res.status(InternalServerError.status).json(InternalServerError)
                if(!(ticket.visitorID===visitor && ticket.executiveID===executive && JWT?.data?.tempID===senderID && ticket.isOpen && !ticket.isClose)) return res.status(Unauthorized.status).json(Unauthorized)
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