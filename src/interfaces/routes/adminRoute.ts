import { Router } from "express";
import adminController from "../controllers/adminController/adminController";
import auth from "../../middlewares/auth";

const adminRoute = Router()

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/pendingDrivers',auth.verifyToken,adminController.pendingDrivers)
adminRoute.get('/driverData',auth.verifyToken,adminController.getDriverData)
adminRoute.get('/verifyDriver',auth.verifyToken,adminController.verifyDriver)
adminRoute.get('/verifiedDrivers',auth.verifyToken,adminController.verifiedDrivers)
adminRoute.get('/blockedDrivers',auth.verifyToken,adminController.blockedDrivers)
adminRoute.post('/rejectDriver',auth.verifyToken,adminController.rejectDriver)
adminRoute.post('/updateDriverStatus',auth.verifyToken,adminController.updateDriverStatus)

adminRoute.get('/verifiedUsers',auth.verifyToken,adminController.verifiedUsers)
adminRoute.get('/pendingUsers',auth.verifyToken,auth.verifyToken,adminController.pendingUsers)
adminRoute.get('/blockedUsers',auth.verifyToken,adminController.blockedUsesrs)
adminRoute.get('/userData',auth.verifyToken,adminController.getUserData)
adminRoute.get('/verifyUser',auth.verifyToken,adminController.verifyUser)
adminRoute.post('/rejectUser',auth.verifyToken,adminController.rejectUser)
adminRoute.post('/updateUserStatus',auth.verifyToken,adminController.updateUserStatus)

adminRoute.get('/getDashboardData',auth.verifyToken,adminController.dashboardData)
adminRoute.get('/driverFeedbacks',auth.verifyToken,adminController.feedbacks)
adminRoute.get('/getDriverRides',auth.verifyToken,adminController.getDriverRides)


export default adminRoute