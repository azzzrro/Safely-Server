import { Router } from "express";
import registrationController from "../controllers/userController/registrationController";
import loginController from "../controllers/userController/loginController";
import upload from "../../middlewares/multer";
import userRideController from "../controllers/userController/userRideController";

const userRoute = Router()

// registration
userRoute.post('/register', registrationController.signup)
userRoute.post('/checkUser', registrationController.checkUser)
userRoute.post('/identification' , upload.single('idImage'), registrationController.identificationUpdate)
userRoute.post('/uploadUserImage' ,upload.single('userImage'), registrationController.uploadUserImage)

// login
userRoute.post('/checkLoginUser',loginController.loginUserCheck)
userRoute.post('/checkGoogleLoginUser',loginController.GoogleLoginUserCheck)

//rides
userRoute.get('/getCurrentRide',userRideController.getCurrentRide)
export default userRoute