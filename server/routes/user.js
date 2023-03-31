import express from "express";
import { createUser, createUsers, getUsers } from "../controllers/user.js";

const router = express.Router();

router.post("/users", createUsers);
router.post("/user", createUser);
router.get("/users", getUsers);

export default router;
