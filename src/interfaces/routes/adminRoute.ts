import { Router } from "express";
import adminController from "../controllers/adminController/adminController";

const adminRoute = Router()

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/pendingDrivers',adminController.pendingDrivers)
adminRoute.get('/driverData',adminController.getDriverData)
adminRoute.get('/verifyDriver',adminController.verifyDriver)
adminRoute.get('/verifiedDrivers',adminController.verifiedDrivers)
adminRoute.get('/blockedDrivers',adminController.blockedDrivers)
adminRoute.post('/rejectDriver',adminController.rejectDriver)
adminRoute.post('/updateDriverStatus',adminController.updateDriverStatus)

adminRoute.get('/verifiedUsers',adminController.verifiedUsers)
adminRoute.get('/pendingUsers',adminController.pendingUsers)
adminRoute.get('/blockedUsers',adminController.blockedUsesrs)
adminRoute.get('/userData',adminController.getUserData)
adminRoute.get('/verifyUser',adminController.verifyUser)
adminRoute.post('/rejectUser',adminController.rejectUser)
adminRoute.post('/updateUserStatus',adminController.updateUserStatus)


export default adminRoute