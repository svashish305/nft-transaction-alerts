import express from "express";
import { createUserController, getUsersController } from "../controllers/user.js";

const router = express.Router();

router.post("/user", createUserController);
router.get("/users", getUsersController);

export default router;
