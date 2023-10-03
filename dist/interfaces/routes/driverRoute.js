"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = __importDefault(require("../controllers/driverController/registrationController"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const loginController_1 = __importDefault(require("../controllers/driverController/loginController"));
const driverCoreController_1 = __importDefault(require("../controllers/driverController/driverCoreController"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const driverRouter = (0, express_1.Router)();
// registration
driverRouter.post("/checkDriver", registrationController_1.default.checkDriver);
driverRouter.post("/registerDriver", registrationController_1.default.register);
driverRouter.post("/identification", multer_1.default.fields([
    { name: "aadharImage", maxCount: 1 },
    { name: "licenseImage", maxCount: 1 },
]), registrationController_1.default.identificationUpdate);
driverRouter.post("/uploadDriverImage", multer_1.default.single("driverImage"), registrationController_1.default.uploadDriverImage);
driverRouter.post("/location", registrationController_1.default.locationUpdate);
driverRouter.post("/vehicleDetails", multer_1.default.fields([
    { name: "carImage", maxCount: 1 },
    { name: "rcImage", maxCount: 1 },
]), registrationController_1.default.vehicleUpdate);
// login
driverRouter.post("/checkLoginDriver", loginController_1.default.loginDriverCheck);
driverRouter.post("/checkGoogleLoginDriver", loginController_1.default.GoogleLoginDriverCheck);
//ride
driverRouter.get("/getCurrentRide", auth_1.default.verifyToken, driverCoreController_1.default.getCurrentRide);
driverRouter.get("/getAllrides", auth_1.default.verifyToken, driverCoreController_1.default.getAllrides);
driverRouter.get("/getRideDetails", auth_1.default.verifyToken, driverCoreController_1.default.getRideDetails);
driverRouter.get("/dashboardData", auth_1.default.verifyToken, driverCoreController_1.default.dashboardData);
driverRouter.get("/driverData", auth_1.default.verifyToken, driverCoreController_1.default.getDriverData);
driverRouter.post("/profileUpdate", auth_1.default.verifyToken, driverCoreController_1.default.profileUpdate);
driverRouter.get("/updateStatus", auth_1.default.verifyToken, driverCoreController_1.default.updateStatus);
exports.default = driverRouter;
