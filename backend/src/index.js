import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import studentRoute from "./routes/student.route.js"
import cors from "cors"

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import adminRoute from "./routes/admin.route.js"
import deanRoute from "./routes/dean.routes.js"

const app = express();
dotenv.config();

const PORT = process.env.PORT
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use(express.json())
app.use(cookieParser());



app.use("/api/auth",authRoutes)
app.use("/api/student", studentRoute)
app.use("/api/admin", adminRoute )
app.use("/api/dean", deanRoute)






app.listen(PORT,(req,res)=>{
  connectDB();
  console.log("port running", PORT)
})