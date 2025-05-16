import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import {getEsignature, getSignedDiploma,getSignedDiplomaByDepartment,digitalSignature} from "../controllers/registrar.controller.js";
import { addEsignature } from "../controllers/registrar.controller.js";
const router = express.Router();

router.get("/getSignedDiploma", protectRoute,getSignedDiploma)
router.get("/getSignedDiplomaByDepartment",protectRoute ,getSignedDiplomaByDepartment)
router.put("/addEsiganture",protectRoute ,addEsignature)
router.get("/getEsignature", protectRoute,getEsignature)
router.post("/digitalSignature", protectRoute, digitalSignature)



export default router;