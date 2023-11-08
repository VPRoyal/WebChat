import { Router } from 'express';
import visitorRouter from "./visitor.js"
import userRouter from "./user.js"
import loginRouter from "./login.js"
import { Success } from '../../../utils/errors.js';
import authenticate from '../../../middlewares/authentication.js';
// import usersRouter from './usersRouter';
// import sendEmailRouter from './sendEmail';
// import authRouter from './authRouter';

const router = Router();
router.get("/", async (req, res) => { res.status(Success.status).json(Success)})
router.use('/visitor', visitorRouter);
router.use('/user', userRouter)
router.use('/login', loginRouter)

export default router;
