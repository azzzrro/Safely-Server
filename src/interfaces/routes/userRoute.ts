import { Router } from "express";
import userController from "../controllers/userController";
import upload from "../../middlewares/multer";
import auth from "../../middlewares/auth";

const userRoute = Router()

userRoute.post('/register', userController.signup)
userRoute.post('/checkUser', userController.checkUser)
userRoute.post('/identification' ,auth.verifyToken, upload.single('idImage'), userController.identificationUpdate)
userRoute.post('/uploadUserImage' ,auth.verifyToken, upload.single('userImage'), userController.uploadUserImage)


export default userRoute