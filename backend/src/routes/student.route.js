import express from "express"
import { requestDiploma, getMyRequests } from "../controllers/student.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/requestDiploma", protectRoute, requestDiploma)

// router.post("/UpdateInfo", protectRoute, UpdateInfo)

router.get("/getStudentRequest",  protectRoute, getMyRequests )

// router.put("/acceptDiploma/:id", protectRoute, acceptDiploma)



export default router;