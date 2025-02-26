import express from "express"
import { requestDiploma, UpdateInfo } from "../controllers/student.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/requestDiploma", protectRoute, requestDiploma)

router.post("/UpdateInfo", protectRoute, UpdateInfo)

// router.put("/acceptDiploma/:id", protectRoute, acceptDiploma)



export default router;