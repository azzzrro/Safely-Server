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
const ride_1 = __importDefault(require("../../../entities/ride"));
const driver_1 = __importDefault(require("../../../entities/driver"));
const user_1 = __importDefault(require("../../../entities/user"));
const mongodb_1 = require("mongodb");
exports.default = {
    getCurrentRide: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const rideId = req.query.rideId;
        const rideData = yield ride_1.default.findOne({ ride_id: rideId });
        if (rideData) {
            const driverData = yield driver_1.default.findOne({ _id: rideData.driver_id });
            res.json({ rideData, driverData });
        }
        else {
            res.json({ message: "Something error" });
        }
    }),
    payment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { amount, paymentMode } = req.body;
        console.log(amount, paymentMode, 1);
        const rideId = req.query.rideId;
        console.log(rideId, 2);
        const rideData = yield ride_1.default.findOne({ ride_id: rideId });
        console.log(rideData, 3);
        const userId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.user_id);
        const driverId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.driver_id);
        console.log(userId, driverId, 3);
        const userData = yield user_1.default.findById(userId);
        const driverData = yield driver_1.default.findById(driverId);
        console.log(userData, driverData, 4);
        if (userData && driverData) {
            if (paymentMode === "COD") {
                try {
                    yield driver_1.default.findByIdAndUpdate(driverId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                            "RideDetails.totalEarnings": amount,
                        },
                        rideStatus: false
                    });
                    yield user_1.default.findByIdAndUpdate(userId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });
                    res.json({ message: "Success" });
                }
                catch (error) {
                    res.json(error.message);
                }
            }
            else if (paymentMode === "wallet") {
                try {
                    const userNewBalance = (userData === null || userData === void 0 ? void 0 : userData.wallet.balance) - amount;
                    const userTransaction = {
                        date: new Date(),
                        details: `Payment for the ride ${rideId}`,
                        amount: -amount,
                        status: "Debit",
                    };
                    yield user_1.default.findByIdAndUpdate(userId, {
                        $set: {
                            "wallet.balance": userNewBalance,
                        },
                        $push: {
                            "wallet.transactions": userTransaction,
                        },
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });
                    const driverNewBalance = driverData.wallet.balance + amount;
                    const driverTransaction = {
                        date: new Date(),
                        details: `Payment for the ride ${rideId}`,
                        amount: amount,
                        staus: "Credit",
                    };
                    yield driver_1.default.findByIdAndUpdate(driverId, {
                        $set: {
                            "wallet.balance": driverNewBalance,
                        },
                        $push: {
                            "wallet.transactions": driverTransaction,
                        },
                        $inc: {
                            "RideDetails.completedRides": 1,
                            "RideDetails.totalEarnings": amount,
                        },
                        rideStatus: false
                    });
                    res.json({ message: "Success" });
                }
                catch (error) {
                    res.json(error.message);
                }
            }
        }
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const response = yield user_1.default.findById(id);
        res.json(response);
    }),
};
