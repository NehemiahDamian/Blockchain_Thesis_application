import express from "express"
import { checkUser, login, logout, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout",logout)

router.get("/checkUser", protectRoute, checkUser)


export default router;