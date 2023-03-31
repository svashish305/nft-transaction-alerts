import express from "express";
import { createEvent, createEvents, getEvents } from "../controllers/event.js";

const router = express.Router();

router.post("/events", createEvents);
router.post("/event", createEvent);
router.get("/events", getEvents);

export default router;
