import "dotenv/config"
import express, { urlencoded } from 'express'
import router from "./routes/index.js";
import cors from "cors"
import cookieParser from "cookie-parser";
const app =express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
const corsOptions={
    origin:"http://localhost:5173",
    credentials:true
}

app.use(cors(corsOptions))
//api endpoints
app.use(router)
// app.get('/',(req,res)=>{
// res.send("hello there")
// })

app.listen(process.env.PORT,()=>{
console.log(`server is running at port ${process.env.PORT}`)
})