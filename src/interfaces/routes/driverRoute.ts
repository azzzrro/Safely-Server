import { Router } from "express";
import registrationController from "../controllers/driverController/registrationController";
import upload from "../../middlewares/multer";
import loginController from "../controllers/driverController/loginController";
import driverCoreController from "../controllers/driverController/driverCoreController";


const driverRouter = Router()


// registration
driverRouter.post('/checkDriver',registrationController.checkDriver)
driverRouter.post('/registerDriver',registrationController.register)
driverRouter.post('/identification',upload.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 }
]), registrationController.identificationUpdate);

driverRouter.post('/uploadDriverImage' ,upload.single('driverImage'), registrationController.uploadDriverImage)
driverRouter.post('/location',registrationController.locationUpdate)
driverRouter.post('/vehicleDetails',upload.fields([
    { name: 'carImage', maxCount: 1 },
    { name: 'rcImage', maxCount: 1 },
  ]), registrationController.vehicleUpdate)

  
// login
driverRouter.post('/checkLoginDriver',loginController.loginDriverCheck)
driverRouter.post('/checkGoogleLoginDriver',loginController.GoogleLoginDriverCheck)


//ride
driverRouter.get('/getCurrentRide',driverCoreController.getCurrentRide)
driverRouter.get('/driverData',driverCoreController.getDriverData)


export default driverRouter