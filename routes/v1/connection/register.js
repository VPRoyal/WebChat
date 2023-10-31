import { Router } from "express";
import pkg from "better-sse";
const {createSession} = pkg
import { authenticate } from "../../../services/authentication.js";
import { subscribe } from "../../../services/channels/handleExecutive.js";
const router = Router();
export default router;