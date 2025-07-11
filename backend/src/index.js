import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import studentRoute from "./routes/student.route.js"
import cors from "cors"

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import adminRoute from "./routes/admin.route.js"
import deanRoute from "./routes/dean.routes.js"
import registrarRoute from "./routes/registrar.route.js"
import verifierRoute from "./routes/verifier.route.js"

const app = express();
dotenv.config();

const PORT = process.env.PORT
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json({ limit: '10mb' })); // Increase payload limit
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());



app.use("/api/auth",authRoutes)
app.use("/api/student", studentRoute)
app.use("/api/admin", adminRoute )
app.use("/api/dean", deanRoute)
app.use("/api/registrar",  registrarRoute)
app.use("/api/verifier", verifierRoute)






app.listen(PORT,(req,res)=>{
  connectDB();
  console.log("port running", PORT)
})