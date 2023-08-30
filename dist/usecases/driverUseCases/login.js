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
exports.default = {
    loginCheckDriver: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield driverRepository_1.default.findDriver(mobile);
        if (response === null || response === void 0 ? void 0 : response.mobile) {
            if (response.verified) {
                return { message: "Success" };
            }
            else if (!response.identification) {
                const token = yield auth_1.default.createToken(response._id.toString());
                return { message: "Incomplete registration", token };
            }
            else {
                return { message: "Not verified" };
            }
        }
        else
            return { message: "No user found" };
    }),
    GoogleLoginCheckDriver: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield driverRepository_1.default.GoogleFindDriver(email);
        if (response === null || response === void 0 ? void 0 : response.email) {
            const token = yield auth_1.default.createToken(response._id.toString());
            if (response.verified) {
                return { message: "Success", token };
            }
            else if (!response.identification) {
                return { message: "Incomplete registration", token };
            }
            else {
                return { message: "Not verified" };
            }
        }
        else
            return { message: "No user found" };
    }),
};
