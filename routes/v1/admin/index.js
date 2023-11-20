import { Router } from 'express';
import { Success } from '../../../utils/errors.js';
const router = Router();
router.get("/", async (req, res) => { res.status(Success.status).json({message: "Admin route is working"})})

export default router;