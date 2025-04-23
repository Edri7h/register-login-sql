
import userRoutes from "./userRoutes.js";
import { Router } from "express";

const router =Router();


router.use("/api/v1/user",userRoutes)

export default router;
