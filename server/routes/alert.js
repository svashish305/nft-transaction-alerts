import express from "express";
import { sendAlert } from "../controllers/alert.js";

const router = express.Router();

router.post("/alert", sendAlert);

export default router;
