import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./lib/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT
app.use(express.json())


app.use("/api/route",authRoutes)


app.listen(PORT,(req,res)=>{
  connectDB();
  console.log("port running", PORT)
})