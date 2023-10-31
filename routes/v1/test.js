import { Router } from "express";
import _ from "better-sse";
import { broadcastByID } from "../../services/channels/handleExecutive.js";
const router = Router();
router.post("/", async (req, res) => {
  const {id}= req.body
  const message="Test Endpoint"
  const event="message"
//   broadcastByID({id, message,event})
res.end("Test end")
})
export default router;