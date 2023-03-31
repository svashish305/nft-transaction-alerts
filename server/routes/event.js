import express from "express";
import { createEventController, getEventsController } from "../controllers/event.js";

const router = express.Router();

router.post("/event", createEventController);
router.get("/events", getEventsController);

export default router;
