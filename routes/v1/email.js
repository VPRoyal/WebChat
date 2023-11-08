import { Router } from "express";
import { emailInstance } from "../../services/email/index.js";
import { InternalServerError, Success } from "../../utils/errors.js";
const router = Router();
router.post("/", async (req, res) => {
  const {token, receiverID, subject, text}=req.body
  const emailReceipt=await emailInstance.sendEmail({receiverID, subject, message: text})
  console.log({emailReceipt})
  if(emailReceipt.success) res.status(Success.status).json(Success)
  else res.status(InternalServerError.status).json(InternalServerError)
})
export default router;