"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registrationController_1 = __importDefault(require("../controllers/userController/registrationController"));
const loginController_1 = __importDefault(require("../controllers/userController/loginController"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const userCoreController_1 = __importDefault(require("../controllers/userController/userCoreController"));
const userRoute = (0, express_1.Router)();
// registration
userRoute.post('/register', registrationController_1.default.signup);
userRoute.post('/checkUser', registrationController_1.default.checkUser);
userRoute.post('/identification', multer_1.default.single('idImage'), registrationController_1.default.identificationUpdate);
userRoute.post('/uploadUserImage', multer_1.default.single('userImage'), registrationController_1.default.uploadUserImage);
// login
userRoute.post('/checkLoginUser', loginController_1.default.loginUserCheck);
userRoute.post('/checkGoogleLoginUser', loginController_1.default.GoogleLoginUserCheck);
//rides
userRoute.get('/getCurrentRide', userCoreController_1.default.getCurrentRide);
userRoute.post('/payment', userCoreController_1.default.payment);
userRoute.get('/userData', userCoreController_1.default.getUserData);
exports.default = userRoute;
