"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = __importDefault(require("../controllers/driverController/registrationController"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const loginController_1 = __importDefault(require("../controllers/driverController/loginController"));
const driverRouter = (0, express_1.Router)();
// registration
driverRouter.post('/checkDriver', registrationController_1.default.checkDriver);
driverRouter.post('/registerDriver', registrationController_1.default.register);
driverRouter.post('/identification', auth_1.default.verifyToken, multer_1.default.fields([
    { name: 'aadharImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 }
]), registrationController_1.default.identificationUpdate);
driverRouter.post('/uploadDriverImage', auth_1.default.verifyToken, multer_1.default.single('driverImage'), registrationController_1.default.uploadDriverImage);
driverRouter.post('/location', auth_1.default.verifyToken, registrationController_1.default.locationUpdate);
// login
driverRouter.post('/checkLoginDriver', loginController_1.default.loginDriverCheck);
driverRouter.post('/checkGoogleLoginDriver', loginController_1.default.GoogleLoginDriverCheck);
exports.default = driverRouter;
