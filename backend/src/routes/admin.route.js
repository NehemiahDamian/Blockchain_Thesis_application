import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptDiploma, rejectDiploma, getDiplomaRequest, sendDiplomaSession,getDiplomaByDepartment } from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/getDiplomaRequest",protectRoute,getDiplomaRequest)

// signupdean

router.put("/acceptDiploma/:id", protectRoute, acceptDiploma)

router.put("/rejectDiploma/:id", protectRoute,rejectDiploma)

// router.get("/getDiplomaByDepartment/:department", protectRoute, getDiplomaByDepartment);

// router.get("/dashboard", protectRoute, dashboard);


// router.post("/digitallySignedDiplomas/registrar", protectRoute,getDigitallySigned)

router.post("/sendDiplomaSession", sendDiplomaSession )
router.get("/checkDiploma",getDiplomaByDepartment)



export default router;