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
const driverRepository_1 = __importDefault(require("../../repositories/driverRepository"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const referralCode_1 = require("../../utilities/referralCode");
const bcrypt_1 = __importDefault(require("../../services/bcrypt"));
const awsS3_1 = __importDefault(require("../../services/awsS3"));
exports.default = {
    checkDriver: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield driverRepository_1.default.findDriver(mobile);
            if (response) {
                if (response.identification) {
                    return { message: "Driver login" };
                }
                else {
                    const token = yield auth_1.default.createToken(response._id.toString());
                    console.log(response._id.toString());
                    return { message: "Driver must fill documents", token };
                }
            }
            return "Driver not registered";
        }
        catch (error) {
            return { message: error.message };
        }
    }),
    personal_details: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, mobile, password, reffered_Code } = userData;
        console.log(reffered_Code);
        const referral_code = (0, referralCode_1.refferalCode)();
        const hashedPassword = yield bcrypt_1.default.securePassword(password);
        const newDriverData = {
            name,
            email,
            mobile,
            password: hashedPassword,
            referral_code: referral_code,
        };
        const response = yield driverRepository_1.default.saveDriver(newDriverData);
        if (typeof response !== "string" && response.email) {
            const token = yield auth_1.default.createToken(response._id.toString());
            return { message: "Success", token };
        }
    }),
    identification_update: (driverData) => __awaiter(void 0, void 0, void 0, function* () {
        const { driverId, aadharID, licenseID, aadharFile, licenseFile } = driverData;
        try {
            const aadharImageUrl = yield (0, awsS3_1.default)(aadharFile);
            const licenseImageUrl = yield (0, awsS3_1.default)(licenseFile);
            const newDriverData = {
                driverId,
                aadharID,
                licenseID,
                aadharImageUrl,
                licenseImageUrl
            };
            console.log(newDriverData, "newuserdattaaa");
            const response = yield driverRepository_1.default.updateIdentification(newDriverData);
            if (response === null || response === void 0 ? void 0 : response.email)
                return ({ message: "Success" });
            else
                return ({ message: "Couldn't update now. Try again later!" });
        }
        catch (error) {
            return error;
        }
    }),
    driverImage_update: (driverData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { driverId, file } = driverData;
            const imageUrl = yield (0, awsS3_1.default)(file);
            const newDriverData = {
                driverId,
                imageUrl
            };
            const response = yield driverRepository_1.default.updateDriverImage(newDriverData);
            if (response === null || response === void 0 ? void 0 : response.email) {
                return ({ message: "Success" });
            }
            else {
                return ({ message: "User not found" });
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    }),
    location_update: (locationData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { longitude, latitude, driverId } = locationData;
            const response = yield driverRepository_1.default.updateDriverLocation(longitude, latitude, driverId);
            if (response === null || response === void 0 ? void 0 : response.email) {
                return ({ message: "Success" });
            }
            else {
                return ({ message: "User not found" });
            }
        }
        catch (error) {
            throw new Error(error.message);
        }
    })
};
