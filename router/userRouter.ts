import express from "express";
import { createUser, deleteUser, getAll, getOne, signIn, verifyUser } from "../controller/userController";


const router = express.Router();

router.route("/create").post(createUser)
router.route("/sign-in").post(signIn)
router.route("/:token/verify").post(verifyUser)
router.route("/:userID/get-one").get(getOne)
router.route("/get-all").get(getAll)
router.route("/:userID/delete").delete(deleteUser)

export default router