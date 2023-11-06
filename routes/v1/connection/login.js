import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import { authenticate } from "../../../services/authentication.js";
import { subscribe } from "../../../services/channels/handleExecutive.js";
import { InvalidCredentials, InvalidParameters } from "../../../utils/errors.js";
import {EXECUTIVE} from "../../../database/index.js"
const router = Router();
router.post("/", async (req, res) => {
        const {email, password}=req.body
        // TODO: Validation Function to validate paramters
        // TODO: Malicious parameter checking fuction (security)
        if(email&&password){
            const user=EXECUTIVE.findUser({email})
            if (user.success){
                if(user.data.email===email && user.data.password===password){
                    // TODO: Has to generate JWT Token here for authentication
                    // TODO: Has to implement some active token DB, so that we can expire on logout.
                    // TODO: Functionality to update data in the executive Database, like lastLogin, ip, device details, etc.
                    res.status(200).json({success:true, data:{userID:user.data.id}, message:"User successfully logged in"})
                }else {res.status(InvalidCredentials.status).json(InvalidCredentials)}
            }else{
                res.status(InvalidParameters.status).json(InvalidParameters)}
        }else{
            res.status(InvalidParameters.status).json(InvalidParameters)
        }
        
})
export default router;