import { Router } from "express";
import adminController from "../controllers/adminController/adminController";

const adminRoute = Router()

adminRoute.post('/login',adminController.adminLogin)
adminRoute.get('/pendingDrivers',adminController.pendingDrivers)
adminRoute.get('/driverData',adminController.getDriverData)
adminRoute.get('/verifyDriver',adminController.verifyDriver)
adminRoute.get('/verifiedDrivers',adminController.verifiedDrivers)
adminRoute.post('/rejectDriver',adminController.rejectDriver)


export default adminRoute