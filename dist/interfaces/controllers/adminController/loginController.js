"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const driver_1 = __importDefault(require("../../../entities/driver"));
const nodemailer_1 = require("../../../services/nodemailer");
exports.default = {
    adminLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            res.json({ message: "Success" });
        }
        else {
            res.json({ message: "Invalid Credentials" });
        }
    }),
    pendingDrivers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pendingDrivers = yield driver_1.default.find({ account_status: "Pending" });
        res.json(pendingDrivers);
    }),
    getDriverData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const response = yield driver_1.default.findById(id);
        res.json(response);
    }),
    verifyDriver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        console.log("insidee funvtion", id);
        try {
            const response = yield driver_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: "Verified",
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account verified successfully";
                const text = `Hello ${response.name}, 
                Thank you for registering with safely! We're excited to have you on board. Your account has been successfully verified, and you're now ready to enjoy the convenience of our cab booking platform.`;
                try {
                    yield (0, nodemailer_1.sendMail)(response.email, subject, text);
                    res.json({ message: "Success" });
                }
                catch (error) {
                    console.log(error);
                    res.json(error.message);
                }
            }
            else {
                res.json("Somthing error");
            }
        }
        catch (error) {
            res.json(error);
        }
    }),
};
