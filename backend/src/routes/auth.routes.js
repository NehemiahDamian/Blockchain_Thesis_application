import express from "express"
import { checkUser, login, logout, signup, forgotPassword,resetPassword, resetPasswordatLoggedIn } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login)

router.post("/logout",logout)

router.get("/checkUser", protectRoute, checkUser)

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.patch('/changepassword', protectRoute,  resetPasswordatLoggedIn )




export default router;