import { Router } from 'express';
import apiRouter from './v1/index.js';

const router = Router();

router.use('/api/v1', apiRouter);
router.get("/", (req, res)=>{
    res.send({
        type: "success",
        message: "You are connected to '/' route"
    })
})

export default router;
