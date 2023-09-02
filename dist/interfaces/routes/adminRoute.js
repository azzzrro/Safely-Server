"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = __importDefault(require("../controllers/adminController/adminController"));
const adminRoute = (0, express_1.Router)();
adminRoute.post('/login', adminController_1.default.adminLogin);
adminRoute.get('/pendingDrivers', adminController_1.default.pendingDrivers);
adminRoute.get('/driverData', adminController_1.default.getDriverData);
adminRoute.get('/verifyDriver', adminController_1.default.verifyDriver);
adminRoute.get('/verifiedDrivers', adminController_1.default.verifiedDrivers);
adminRoute.post('/rejectDriver', adminController_1.default.rejectDriver);
exports.default = adminRoute;
