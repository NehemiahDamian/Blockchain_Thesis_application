import express from "express"
import { requestDiploma, getMyRequests } from "../controllers/student.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/requestDiploma", upload.fields([
  { name: 'paymentReceipt', maxCount: 1 },
  { name: 'affidavitOfLoss', maxCount: 1 }
]), protectRoute,requestDiploma);

// router.post("/UpdateInfo", protectRoute, UpdateInfo)

router.get("/getStudentRequest",  protectRoute, getMyRequests )

// router.put("/acceptDiploma/:id", protectRoute, acceptDiploma)



export default router;