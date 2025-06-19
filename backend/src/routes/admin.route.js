import express from "express"
import { protectRoute } from "../middlewares/auth.middleware.js";
import { acceptDiploma, rejectDiploma, getDiplomaRequest, sendDiplomaSession,getDiplomaByDepartment,adminGetSignedDiploma,getStudentforBlockchainUpload,getSignedDiplomaByDepartment,uploadtoArchive,getAllstudentsArchiveByDepartment,getStatistics,getRegisteredDean,sendcredentialsToEmail,addCollege, getCollege
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/getDiplomaRequest",getDiplomaRequest)

router.put("/acceptDiploma/:id", acceptDiploma)

router.put("/rejectDiploma/:id", rejectDiploma)

router.get("/adminGetSignedDiploma", adminGetSignedDiploma)

router.get("/getStudentforBlockchainUpload", getStudentforBlockchainUpload)

router.post("/sendDiplomaSession", sendDiplomaSession )

router.get("/checkDiploma",getDiplomaByDepartment)

router.get("/getSignedDiplomaByDepartment",getSignedDiplomaByDepartment)

router.post("/archiveUploadedDiploma", uploadtoArchive)

router.get("/getAlldepartment", getAllstudentsArchiveByDepartment)

router.get("/statistics", getStatistics)

router.get("/getAllDean",getRegisteredDean)

router.post("/sendCredentials", sendcredentialsToEmail)

router.post("/addCollege", addCollege)

router.get("/getCollege",  getCollege)

// router.patch("/deanStatusHandler/:id", deanStatusHandler)

export default router;









