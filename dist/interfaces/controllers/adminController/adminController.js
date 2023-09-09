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
const user_1 = __importDefault(require("../../../entities/user"));
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
        try {
            const response = yield driver_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: "Good",
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Verified Successfully";
                const text = `Hello ${response.name}, 
                Thank you for registering with safely! We're excited to have you on board. Your account has been successfully verified.
                
                Thank you for choosing Safely. We look forward to serving you and making your journeys safe and convenient.
                
                Best regards,
                Safely India`;
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
    verifiedDrivers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const verifiedDrivers = yield driver_1.default.find({ account_status: { $nin: ["Pending", "Rejected", "Blocked"] } });
        res.json(verifiedDrivers);
    }),
    rejectDriver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const reason = req.body.reason;
        try {
            const response = yield driver_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: "Rejected",
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Registration Rejected";
                const text = `Hello ${response.name}, 
                We regret to inform you that your registration with Safely has been rejected. We appreciate your interest, 
                but unfortunately, we are unable to accept your application at this time.
                
                Reason : ${reason}

                You have the option to resubmit your registration and provide any missing or updated information.

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`;
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
    updateDriverStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newStatus;
        const id = req.query.id;
        const { reason, status } = req.body;
        if (status === 'Block')
            newStatus = 'Blocked';
        else
            newStatus = status;
        try {
            const response = yield driver_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: newStatus,
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Status Updated";
                const text = `Hello ${response.name}, 

                We inform you that your Safely account status has been updated.

                Status : ${newStatus}
                Reason : ${reason}

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`;
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
    blockedDrivers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blocledDrivers = yield driver_1.default.find({ account_status: "Blocked" });
        res.json(blocledDrivers);
    }),
    verifiedUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const verifiedUsers = yield user_1.default.find({ account_status: { $nin: ["Pending", "Rejected", "Blocked"] } });
        res.json(verifiedUsers);
    }),
    pendingUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const pendingUsers = yield user_1.default.find({ account_status: "Pending" });
        res.json(pendingUsers);
    }),
    blockedUsesrs: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blockedUsesrs = yield user_1.default.find({ account_status: "Blocked" });
        res.json(blockedUsesrs);
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const response = yield user_1.default.findById(id);
        res.json(response);
    }),
    verifyUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        try {
            const response = yield user_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: "Good",
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Verified Successfully";
                const text = `Hello ${response.name}, 
                Thank you for registering with safely! We're excited to have you on board. Your account has been successfully verified.
                
                Thank you for choosing Safely. We look forward to serving you and making your journeys safe and convenient.
                
                Best regards,
                Safely India`;
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
    rejectUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const reason = req.body.reason;
        try {
            const response = yield user_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: "Rejected",
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Registration Rejected";
                const text = `Hello ${response.name}, 
                We regret to inform you that your registration with Safely has been rejected. We appreciate your interest, 
                but unfortunately, we are unable to accept your application at this time.
                
                Reason : ${reason}

                You have the option to resubmit your registration and provide any missing or updated information.

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`;
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
    updateUserStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let newStatus;
        const id = req.query.id;
        const { reason, status } = req.body;
        if (status === 'Block')
            newStatus = 'Blocked';
        else
            newStatus = status;
        try {
            const response = yield user_1.default.findByIdAndUpdate(id, {
                $set: {
                    account_status: newStatus,
                },
            }, {
                new: true,
            });
            if (response === null || response === void 0 ? void 0 : response.email) {
                const subject = "Account Status Updated";
                const text = `Hello ${response.name}, 

                We inform you that your Safely account status has been updated.

                Status : ${newStatus}
                Reason : ${reason}

                If you have any questions or need further information, please feel free to contact our support team.
                
                Sincerely,
                Safely India`;
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
