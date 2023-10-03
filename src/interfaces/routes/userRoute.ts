import { Router } from "express";
import registrationController from "../controllers/userController/registrationController";
import loginController from "../controllers/userController/loginController";
import upload from "../../middlewares/multer";
import userCoreController from "../controllers/userController/userCoreController";
import auth from "../../middlewares/auth";

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
userRoute.get('/userData',auth.verifyToken,userCoreController.getUserData)
userRoute.get('/getCurrentRide',auth.verifyToken,userCoreController.getCurrentRide)
userRoute.post('/payment',auth.verifyToken,userCoreController.payment)
userRoute.post('/payment-stripe',auth.verifyToken,userCoreController.paymentStripe)

userRoute.get('/getAllrides',auth.verifyToken,userCoreController.getAllrides)
userRoute.get('/getRideDetails',auth.verifyToken,userCoreController.getRideDetails)
userRoute.post('/feedback',auth.verifyToken,userCoreController.feedback)
userRoute.post('/profileUpdate',auth.verifyToken,userCoreController.profileUpdate)
userRoute.post('/addWalletBalance',auth.verifyToken,userCoreController.addbalance)

export default userRoute