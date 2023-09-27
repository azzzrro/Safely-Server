import { Router } from "express";
import registrationController from "../controllers/userController/registrationController";
import loginController from "../controllers/userController/loginController";
import upload from "../../middlewares/multer";
import userCoreController from "../controllers/userController/userCoreController";

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
userRoute.get('/userData',userCoreController.getUserData)
userRoute.get('/getCurrentRide',userCoreController.getCurrentRide)
userRoute.post('/payment',userCoreController.payment)
userRoute.post('/payment-stripe',userCoreController.paymentStripe)

userRoute.get('/getAllrides',userCoreController.getAllrides)
userRoute.get('/getRideDetails',userCoreController.getRideDetails)
userRoute.post('/feedback',userCoreController.feedback)
userRoute.post('/profileUpdate',userCoreController.profileUpdate)
userRoute.post('/addWalletBalance',userCoreController.addbalance)

export default userRoute