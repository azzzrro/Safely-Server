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
exports.setUpSocketIO = exports.calculateDistance = exports.generatePIN = void 0;
const socket_io_1 = require("socket.io");
const ride_1 = __importDefault(require("../entities/ride"));
const driver_1 = __importDefault(require("../entities/driver"));
const moment_1 = __importDefault(require("moment"));
const generatePIN = () => {
    let pin = "";
    for (let i = 0; i < 6; i++) {
        pin += Math.floor(Math.random() * 10);
    }
    return parseInt(pin);
};
exports.generatePIN = generatePIN;
const calculateDistance = (driverLatitude, driverLongitude, userLatitude, userLongitude) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deg2rad = (deg) => deg * (Math.PI / 180);
    driverLatitude = deg2rad(driverLatitude);
    driverLongitude = deg2rad(driverLongitude);
    userLatitude = deg2rad(userLatitude);
    userLongitude = deg2rad(userLongitude);
    const radius = 6371;
    const dlat = userLatitude - driverLatitude;
    const dlon = userLongitude - driverLongitude;
    const a = Math.sin(dlat / 2) ** 2 + Math.cos(driverLatitude) * Math.cos(driverLongitude) * Math.sin(dlon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = radius * c;
    return distance;
};
exports.calculateDistance = calculateDistance;
const setUpSocketIO = (server) => {
    let driverLatitude;
    let driverLongitude;
    let rideDetails;
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });
    io.on("connection", (socket) => {
        console.log("Client-side connected:", socket.id);
        socket.on("getNearByDrivers", (rideData) => __awaiter(void 0, void 0, void 0, function* () {
            rideDetails = rideData;
            console.log(rideDetails, "ride-details");
            io.emit("getNearByDrivers");
        }));
        socket.on("driverLocation", (latitude, longitude) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                driverLatitude = latitude;
                driverLongitude = longitude;
                const distance = (0, exports.calculateDistance)(driverLatitude, driverLongitude, rideDetails.pickupCoordinates.latitude, rideDetails.pickupCoordinates.longitude);
                if (distance <= 5) {
                    const driverIds = yield driver_1.default
                        .find({ "vehicle_details.model": rideDetails.model, account_status: { $in: ["Good", "Warning"] }, rideStatus: false })
                        .select("_id")
                        .exec();
                    const idsArray = driverIds.map((driver) => driver._id);
                    console.log(idsArray);
                    io.emit("newRideRequest", rideDetails, idsArray);
                }
                else {
                    console.log(distance, "greater than 5km");
                }
            }
            catch (error) {
                console.error("Error handling driver location:", error);
            }
        }));
        socket.on("acceptRide", (acceptedRideData) => __awaiter(void 0, void 0, void 0, function* () {
            const currentDateTime = (0, moment_1.default)().format("YYYY-MM-DD hh:mm:ss A");
            acceptedRideData.status = "Pending";
            acceptedRideData.date = currentDateTime;
            acceptedRideData.pin = (0, exports.generatePIN)();
            acceptedRideData.driverCoordinates = {};
            acceptedRideData.driverCoordinates.latitude = driverLatitude;
            acceptedRideData.driverCoordinates.longitude = driverLongitude;
            const newRide = new ride_1.default(acceptedRideData);
            const response = yield newRide.save();
            yield driver_1.default.findByIdAndUpdate(acceptedRideData.driver_id, {
                rideStatus: true
            });
            console.log(response, "response after saving");
            io.emit("driverConfirmation", response.ride_id);
            io.emit("userConfirmation", response.ride_id);
        }));
        socket.on("verifyRide", (pin) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("inside verify", pin);
            const response = yield ride_1.default.findOneAndUpdate({ pin: pin }, {
                $set: {
                    status: "Confirmed",
                },
            }, {
                new: true,
            });
            console.log(response, "response");
            if (response) {
                io.emit("rideConfirmed");
            }
            else {
                io.emit("error in confirming ride");
            }
        }));
        socket.on("driverRideFinish", () => {
            console.log("server response getting");
            io.emit("userPaymentPage");
        });
        socket.on("paymentCompleted", () => {
            io.emit("driverPaymentSuccess");
        });
        socket.on("disconnect", () => {
            console.log("Client-side disconnected:", socket.id);
        });
    });
};
exports.setUpSocketIO = setUpSocketIO;
