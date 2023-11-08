import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import AUTH from "../../../middlewares/authentication.js";
import { subscribe } from "../../../services/channels/handleExecutive.js";
const router = Router();
router.get("/", AUTH.user, async (req, res) => {
    let {userID } = req.query
    // TODO: Authentication function to verify data
    // TODO: Has to register him in the database
    // TODO: Create function to generate data object
    const data={
        userID,
        lastConnected:Date.now(),
        activeTickets:[]
    }
    const session = await createSession(req, res);
    session.state = data;
    session.push({message: "Executive connected"},"user");

    subscribe(session);
});

export default router;
