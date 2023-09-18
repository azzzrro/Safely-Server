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
const registration_1 = __importDefault(require("../../../usecases/driverUseCases/registration"));
const awsS3_1 = __importDefault(require("../../../services/awsS3"));
const driver_1 = __importDefault(require("../../../entities/driver"));
const mongodb_1 = require("mongodb");
exports.default = {
    checkDriver: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mobile } = req.body;
        try {
            const response = yield registration_1.default.checkDriver(mobile);
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, mobile, password, reffered_Code } = req.body;
        const userData = {
            name,
            email,
            mobile,
            password,
            reffered_Code,
        };
        try {
            const response = yield registration_1.default.personal_details(userData);
            console.log(response, "responseee");
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    identificationUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { aadharID, licenseID } = req.body;
        const driverId = req.query.driverId;
        const files = req.files;
        try {
            if (driverId) {
                const driverData = {
                    driverId: new mongodb_1.ObjectId(driverId),
                    aadharID,
                    licenseID,
                    aadharFile: files["aadharImage"][0],
                    licenseFile: files["licenseImage"][0],
                };
                const response = yield registration_1.default.identification_update(driverData);
                console.log(response, "responseyyy");
                res.json(response);
            }
            else {
                res.json({ message: "something error" });
            }
        }
        catch (error) {
            res.json(error);
        }
    }),
    uploadDriverImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const driverId = req.query.driverId;
        try {
            if (driverId && req.file) {
                const driverData = {
                    driverId: new mongodb_1.ObjectId(driverId),
                    file: req.file,
                };
                const response = yield registration_1.default.driverImage_update(driverData);
                res.json(response);
            }
            else {
                res.json({ message: "Something error" });
            }
        }
        catch (error) {
            res.json(error.message);
        }
    }),
    locationUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const driverId = req.query.driverId;
        try {
            if (driverId) {
                const { latitude, longitude } = req.body;
                const data = {
                    driverId: new mongodb_1.ObjectId(driverId),
                    latitude,
                    longitude,
                };
                const response = yield registration_1.default.location_update(data);
                res.json(response);
            }
        }
        catch (error) {
            res.json(error.message);
        }
    }),
    vehicleUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("inside vehicleeeee");
            const { registerationID, model } = req.body;
            const files = req.files;
            const driverId = req.query.driverId;
            console.log(registerationID, model, driverId);
            const rcImageUrl = yield (0, awsS3_1.default)(files["rcImage"][0]);
            const carImageUrl = yield (0, awsS3_1.default)(files["carImage"][0]);
            const response = yield driver_1.default.findByIdAndUpdate(driverId, {
                $set: {
                    vehicle_details: {
                        registerationID,
                        model,
                        rcImageUrl,
                        carImageUrl
                    }
                }
            }, {
                new: true
            });
            console.log(response, "vehickeeee");
            if (response === null || response === void 0 ? void 0 : response.email) {
                res.json({ message: "Success" });
            }
            else {
                res.json({ message: "Something Error" });
            }
        }
        catch (error) {
            res.json(error.message);
        }
    })
};
