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
const driver_1 = __importDefault(require("../entities/driver"));
exports.default = {
    findDriver: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield driver_1.default.findOne({ mobile: mobile });
        return result;
    }),
    saveDriver: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const newDriver = new driver_1.default({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: userData.password,
            referral_code: userData.referral_code,
        });
        try {
            const savedDriver = yield newDriver.save();
            return savedDriver;
        }
        catch (error) {
            return error.message;
        }
    }),
    updateIdentification: (driverData) => __awaiter(void 0, void 0, void 0, function* () {
        const { driverId, aadharID, licenseID, aadharImageUrl, licenseImageUrl } = driverData;
        console.log(driverData, "query dattaaaa");
        const response = yield driver_1.default.findByIdAndUpdate(driverId, {
            $set: {
                aadhar: {
                    aadharId: aadharID,
                    aadharImage: aadharImageUrl
                },
                license: {
                    licenseId: licenseID,
                    licenseImage: licenseImageUrl
                }
            },
        }, {
            new: true,
        });
        return response;
    }),
    updateDriverImage: (driverData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { driverId, imageUrl } = driverData;
            const response = yield driver_1.default.findByIdAndUpdate(driverId, {
                $set: {
                    driverImage: imageUrl,
                    // identification:true
                },
            }, {
                new: true
            });
            return response;
        }
        catch (error) {
            throw new Error(error.message);
        }
    })
};
