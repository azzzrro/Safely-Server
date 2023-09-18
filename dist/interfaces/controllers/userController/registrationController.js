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
const registration_1 = __importDefault(require("../../../usecases/userUseCases/registration"));
const mongodb_1 = require("mongodb");
exports.default = {
    signup: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    checkUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mobile } = req.body;
        try {
            const response = yield registration_1.default.checkUser(mobile);
            res.json(response);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }),
    identificationUpdate: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { chooseID, enterID } = req.body;
        const userId = req.query.driverId;
        try {
            if (userId && req.file) {
                const userData = {
                    userId: new mongodb_1.ObjectId(userId),
                    chooseID,
                    enterID,
                    file: req.file
                };
                const response = yield registration_1.default.identification_update(userData);
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
    uploadUserImage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.query.driverId;
        try {
            if (userId && req.file) {
                const userData = {
                    userId: new mongodb_1.ObjectId(userId),
                    file: req.file
                };
                const response = yield registration_1.default.userimage_update(userData);
                res.json(response);
            }
            else {
                res.json({ message: "Something error" });
            }
        }
        catch (error) {
            res.json(error.message);
        }
    })
};
