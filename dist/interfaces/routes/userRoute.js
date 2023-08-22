"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const multer_1 = __importDefault(require("../../middlewares/multer"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const userRoute = (0, express_1.Router)();
userRoute.post('/register', userController_1.default.signup);
userRoute.post('/checkUser', userController_1.default.checkUser);
userRoute.post('/identification', auth_1.default.verifyToken, multer_1.default.single('idImage'), userController_1.default.identificationUpdate);
userRoute.post('/uploadUserImage', auth_1.default.verifyToken, multer_1.default.single('userImage'), userController_1.default.uploadUserImage);
exports.default = userRoute;
