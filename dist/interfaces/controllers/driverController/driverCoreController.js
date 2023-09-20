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
    getDriverData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = req.query.id;
        const response = yield driver_1.default.findById(id);
        res.json(response);
    }),
};
