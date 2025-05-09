import express from "express"
import { verifierLogic } from "../controllers/verifier.controller.js";
const router = express.Router();

router.get("/verifierTae", verifierLogic)



export default router;