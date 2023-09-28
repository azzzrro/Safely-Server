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
const moment_1 = __importDefault(require("moment"));
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
    getAllrides: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { driver_id } = req.query;
        const rideData = yield ride_1.default.find({ driver_id: driver_id }).sort({ date: -1 });
        if (rideData) {
            const formattedData = rideData.map((ride) => (Object.assign(Object.assign({}, ride.toObject()), { date: (0, moment_1.default)(ride.date).format("dddd, DD-MM-YYYY") })));
            res.json(formattedData);
        }
        else {
            res.status(500).json({ message: "Soemthing Internal Error" });
        }
    }),
    getRideDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { ride_id } = req.query;
        const rideData = yield ride_1.default.findOne({ ride_id: ride_id });
        res.json(rideData);
    }),
    dashboardData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { driver_id } = req.query;
        try {
            const data = yield ride_1.default
                .aggregate([
                {
                    $match: {
                        status: { $nin: ["Cancelled", "Pending"] },
                        driver_id: driver_id,
                    },
                },
                {
                    $group: {
                        _id: { $month: "$date" },
                        totalAmount: { $sum: "$price" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: "$_id",
                        totalAmount: 1,
                    },
                },
                {
                    $sort: { month: 1 },
                },
            ])
                .exec();
            const monthNames = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
            ];
            const chartData = data.map((item) => ({
                name: monthNames[item.month - 1],
                Earnings: item.totalAmount,
            }));
            const pieChartData = yield ride_1.default
                .aggregate([
                {
                    $match: {
                        status: { $nin: ["Cancelled", "Pending"] },
                        driver_id: driver_id,
                    },
                },
                {
                    $group: {
                        _id: "$paymentMode",
                        count: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        name: "$_id",
                        value: "$count",
                    },
                },
            ])
                .exec();
            const driverData = yield driver_1.default.findById(driver_id);
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1;
            const count = yield ride_1.default
                .aggregate([
                {
                    $match: {
                        status: "Completed",
                        date: {
                            $gte: new Date(currentDate.getFullYear(), currentMonth - 1, 1),
                            $lt: new Date(currentDate.getFullYear(), currentMonth, 1), // Start of next month
                        },
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalCount: { $sum: 1 },
                    },
                },
            ])
                .exec();
            res.json({ chartData, pieChartData, driverData, CurrentMonthRides: count[0].totalCount });
        }
        catch (error) {
            res.status(500).json(error.message);
        }
    }),
    getDriverData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { driver_id } = req.query;
        const driverData = yield driver_1.default.findById(driver_id);
        res.json(driverData);
    }),
    profileUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { driver_id } = req.query;
        const { name, email, mobile } = req.body;
        try {
            const updateFields = {};
            if (name) {
                updateFields.name = name;
            }
            if (email) {
                updateFields.email = email;
            }
            if (mobile) {
                updateFields.mobile = mobile;
            }
            const driverData = yield driver_1.default
                .findOneAndUpdate({ _id: driver_id }, { $set: updateFields }, { new: true })
                .exec();
            res.json({ message: "Success", driverData });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),
    updateStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { driver_id } = req.query;
        console.log("helloo", driver_id);
        try {
            const data = yield driver_1.default.findById(driver_id);
            const driverData = yield driver_1.default.findByIdAndUpdate(driver_id, {
                $set: {
                    isAvailable: !(data === null || data === void 0 ? void 0 : data.isAvailable),
                },
            }, {
                new: true,
            });
            res.status(201).json({ message: "Success", driverData });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }),
};
