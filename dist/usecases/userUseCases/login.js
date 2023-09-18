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
const auth_1 = __importDefault(require("../../middlewares/auth"));
const userRepository_1 = __importDefault(require("../../repositories/userRepository"));
exports.default = {
    loginCheckUser: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userRepository_1.default.findUser(mobile);
        if (response === null || response === void 0 ? void 0 : response.mobile) {
            if (response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked") {
                const token = yield auth_1.default.createToken(response._id.toString());
                return { message: "Success", name: response.name, token, _id: response._id };
            }
            else if (response.account_status === "Rejected") {
                return { message: "Rejected", userId: response._id };
            }
            else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            }
            else if (!response.identification) {
                return { message: "Incomplete registration", userId: response._id };
            }
            else {
                return { message: "Not verified" };
            }
        }
        else
            return { message: "No user found" };
    }),
    GoogleLoginCheckUser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield userRepository_1.default.GoogleFindUser(email);
        if (response === null || response === void 0 ? void 0 : response.email) {
            if (response.account_status !== "Pending" &&
                response.account_status !== "Rejected" &&
                response.account_status !== "Blocked") {
                const token = yield auth_1.default.createToken(response._id.toString());
                return { message: "Success", name: response.name, token, _id: response._id };
            }
            else if (response.account_status === "Rejected") {
                return { message: "Rejected", userId: response._id };
            }
            else if (response.account_status === "Blocked") {
                return { message: "Blocked" };
            }
            else if (!response.identification) {
                return { message: "Incomplete registration", userId: response._id };
            }
            else {
                return { message: "Not verified" };
            }
        }
        else
            return { message: "No user found" };
    }),
};
