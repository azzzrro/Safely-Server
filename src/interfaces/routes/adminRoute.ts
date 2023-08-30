import { Router } from "express";
import loginController from "../controllers/adminController/loginController";

const adminRoute = Router()

adminRoute.post('/login',loginController.adminLogin)

export default adminRoute