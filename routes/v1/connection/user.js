import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import { authenticate } from "../../../services/authentication.js";
import { subscribe } from "../../../services/channels/handleExecutive.js";
const router = Router();
router.get("/", async (req, res) => {
    let {token, userID } = req.query
    // TODO: Authentication function to verify data
  const isAuthentic = authenticate(token);
  if (isAuthentic) {
    // TODO: Has to register him in the database
    // TODO: Create function to generate data object
    const data={
        token,
        userID,
        lastConnected:Date.now(),
        activeTickets:[]
    }
    const session = await createSession(req, res);
    session.state = data;
    session.push({message: "Executive connected"},"user");

    subscribe(session);
  } else {
    res.status(Unauthorized.status).json(Unauthorized);
  }
});

export default router;