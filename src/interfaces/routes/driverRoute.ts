import { Router } from "express";
import registrationController from "../controllers/driverController/registrationController";
import upload from "../../middlewares/multer";
import auth from "../../middlewares/auth";
import loginController from "../controllers/driverController/loginController";



const driverRouter = Router()


// registration
driverRouter.post('/checkDriver',registrationController.checkDriver)
driverRouter.post('/registerDriver',registrationController.register)
driverRouter.post('/identification',auth.verifyToken, upload.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 }
]), registrationController.identificationUpdate);

driverRouter.post('/uploadDriverImage' ,auth.verifyToken, upload.single('driverImage'), registrationController.uploadDriverImage)
driverRouter.post('/location',auth.verifyToken,registrationController.locationUpdate)

// login
driverRouter.post('/checkLoginDriver',loginController.loginDriverCheck)
driverRouter.post('/checkGoogleLoginDriver',loginController.GoogleLoginDriverCheck)

export default driverRouter