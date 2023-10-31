import { Router } from 'express';
import testRouter from './test.js'
import connectionRouter from './connection/index.js'
import chatRouter from './chat.js'
// import usersRouter from './usersRouter';
// import sendEmailRouter from './sendEmail';
// import authRouter from './authRouter';

const router = Router();

router.use('/connection', connectionRouter);
router.use('/chat', chatRouter)
export default router;
