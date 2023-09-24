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
const stripe_1 = __importDefault(require("stripe"));
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
        const rideId = req.query.rideId;
        const rideData = yield ride_1.default.findOne({ ride_id: rideId });
        const userId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.user_id);
        const driverId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.driver_id);
        const userData = yield user_1.default.findById(userId);
        const driverData = yield driver_1.default.findById(driverId);
        if (userData && driverData) {
            console.log("undalloooo");
            console.log("heeeeee");
            if (paymentMode === "COD") {
                try {
                    yield driver_1.default.findByIdAndUpdate(driverId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                            "RideDetails.totalEarnings": amount,
                        },
                        isAvailable: true,
                    });
                    yield user_1.default.findByIdAndUpdate(userId, {
                        $inc: {
                            "RideDetails.completedRides": 1,
                        },
                    });
                    yield ride_1.default.findOneAndUpdate({ ride_id: rideId }, {
                        paymentMode: paymentMode,
                        status: "Completed",
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
                        isAvailable: true,
                    });
                    yield ride_1.default.findOneAndUpdate({ ride_id: rideId }, {
                        paymentMode: paymentMode,
                        status: "Completed",
                    });
                    res.json({ message: "Success" });
                }
                catch (error) {
                    res.json(error.message);
                }
            }
        }
    }),
    paymentStripe: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { amount } = req.body;
        const rideId = req.query.rideId;
        const stripe = new stripe_1.default(process === null || process === void 0 ? void 0 : process.env.STRIPE_SECRET_KEY, {
            apiVersion: "2023-08-16",
        });
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Safely-cab-booking",
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `http://localhost:5173/rides?rideId=${rideId}`,
            cancel_url: "http://localhost:5173/rides",
        });
        if (session) {
            console.log(session, "session und");
            try {
                const rideData = yield ride_1.default.findOne({ ride_id: rideId });
                console.log(rideData, "ridedataa");
                const userId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.user_id);
                const driverId = new mongodb_1.ObjectId(rideData === null || rideData === void 0 ? void 0 : rideData.driver_id);
                const driverData = yield driver_1.default.findById(driverId);
                const driverNewBalance = (driverData === null || driverData === void 0 ? void 0 : driverData.wallet.balance) + amount;
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
                    isAvailable: true,
                });
                yield user_1.default.findByIdAndUpdate(userId, {
                    $inc: {
                        "RideDetails.completedRides": 1,
                    },
                });
                yield ride_1.default.findOneAndUpdate({ ride_id: rideId }, {
                    paymentMode: "Card payment",
                    status: "Completed",
                });
                res.json({ id: session.id });
            }
            catch (error) {
                res.status(500).json(error.message);
            }
        }
        else {
            console.log("no session");
            res.json({ message: "No session" });
        }
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const response = yield user_1.default.findById(id);
        res.json(response);
    }),
    getAllrides: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { user_id } = req.query;
        const rideData = yield ride_1.default.find({ user_id: user_id });
        res.json(rideData);
    }),
    getRideDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ride_id } = req.query;
        const rideData = yield ride_1.default.findOne({ ride_id: ride_id });
        const driverData = yield driver_1.default.findById(rideData === null || rideData === void 0 ? void 0 : rideData.driver_id);
        res.json({ rideData, driverData });
    }),
    feedback: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { _id } = req.query;
        const { rating, feedback } = req.body;
        try {
            const rideData = yield ride_1.default.findByIdAndUpdate(_id, {
                $set: {
                    rating: rating,
                    feedback: feedback,
                },
            }, { new: true });
            yield driver_1.default.findByIdAndUpdate(rideData === null || rideData === void 0 ? void 0 : rideData.driver_id, {
                $inc: {
                    "ratings": 1
                }
            });
            res.json({ message: "Success" });
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }),
};