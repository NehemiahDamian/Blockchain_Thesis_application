import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getDiplomaByDepartment, getEsignature, addEsignature } from "../controllers/dean.controller.js";
const router = express.Router();

router.get("/getEsignature",protectRoute,getEsignature)

router.get("/getdiploma", getDiplomaByDepartment)

router.put("/addEsignature",protectRoute, addEsignature)

// router.post("/digitallySignedDiplomas/dean", protectRoute, getDigitallySigned)



export default router;