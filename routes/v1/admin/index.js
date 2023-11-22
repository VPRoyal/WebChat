import { Router } from 'express';
import { Success } from '../../../utils/errors.js';
const router = Router();
router.get("/", async (req, res) => { res.status(Success.status).json({message: "Admin route is working"})})
router.get("/login", async (req, res)=>{

})
router.post("/addUsers", async (req, res)=>{

})
router.post("/removeUsers", async (req, res)=>{

})
router.get("/getUsers", async (req, res)=>{
    
})
export default router;