"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = __importDefault(require("../controllers/adminController/loginController"));
const adminRoute = (0, express_1.Router)();
adminRoute.post('/login', loginController_1.default.adminLogin);
exports.default = adminRoute;
