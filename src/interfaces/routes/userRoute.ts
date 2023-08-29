import { Router } from "express";
import registrationController from "../controllers/userController/registrationController";
import loginController from "../controllers/userController/loginController";
import upload from "../../middlewares/multer";
import auth from "../../middlewares/auth";

const userRoute = Router()

// registration
userRoute.post('/register', registrationController.signup)
userRoute.post('/checkUser', registrationController.checkUser)
userRoute.post('/identification' ,auth.verifyToken, upload.single('idImage'), registrationController.identificationUpdate)
userRoute.post('/uploadUserImage' ,auth.verifyToken, upload.single('userImage'), registrationController.uploadUserImage)

// login
userRoute.post('/checkLoginUser',loginController.loginUserCheck)
userRoute.post('/checkGoogleLoginUser',loginController.GoogleLoginUserCheck)


export default userRoute