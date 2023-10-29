import express from "express";
import { createUser } from "../controller/userController";

const router = express.Router();

router.route("/create").post(createUser)

export default router