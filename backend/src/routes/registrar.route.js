import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import {getSignedDiploma } from "../controllers/registrar.controller.js";
const router = express.Router();

router.get("/getSignedDiploma", getSignedDiploma)





export default router;