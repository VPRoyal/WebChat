import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import Jwt from "jsonwebtoken";
import {config} from "dotenv"
config()

import { authenticate } from "../../../services/authentication.js";
import { subscribe } from "../../../services/channels/handleExecutive.js";
import { InternalServerError, InvalidCredentials, InvalidParameters } from "../../../utils/errors.js";
import {EXECUTIVE} from "../../../database/index.js"
const router = Router();
router.post("/", async (req, res) => {
        const {email, pass}=req.body
        // TODO: Validation Function to validate paramters
        // TODO: Malicious parameter checking fuction (security)
        // TODO: Can also be improved to use passport verification.
        try {
        if(email&&pass){
            const user=await EXECUTIVE.findUser({email})
            if (user.success){
                if(user.data.email===email && user.data.password===pass){
                    const secretKey= process.env.JWT_SECRET_KEY
                    const token =Jwt.sign({tempID: user.data.id}, secretKey, { expiresIn: 24*60*60 })
                    // TODO: Has to generate JWT Token here for authentication
                    // TODO: Has to implement some active token DB, so that we can expire on logout.
                    // TODO: Functionality to update data in the executive Database, like lastLogin, ip, device details, etc.
                    res.status(200).json({success:true, data:{userID:user.data.id, token}, message:"User successfully logged in"})
                }else {res.status(InvalidCredentials.status).json(InvalidCredentials)}
            }else{
                res.status(InvalidCredentials.status).json(InvalidCredentials)}
        }else{
            res.status(InvalidParameters.status).json(InvalidParameters)
        }
    }
        catch (error) {
            res.status(InternalServerError.status).json(InternalServerError)
        }
        
})
export default router;