import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getDiplomaByDepartment, getEsignature, addEsignature, digitalSignature } from "../controllers/dean.controller.js";
const router = express.Router();

router.get("/getEsignature",protectRoute,getEsignature)

router.get("/getdiploma",protectRoute, getDiplomaByDepartment)

router.put("/addEsignature",protectRoute, addEsignature)

router.post("/digitalSignature", protectRoute, digitalSignature)



export default router;