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
const userRepository_1 = __importDefault(require("../../repositories/userRepository"));
const referralCode_1 = require("../../utilities/referralCode");
const bcrypt_1 = __importDefault(require("../../services/bcrypt"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const awsS3_1 = __importDefault(require("../../services/awsS3"));
exports.default = {
    checkUser: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield userRepository_1.default.findUser(mobile);
            if (response) {
                if (response.identification) {
                    return { message: "User login" };
                }
                else {
                    const token = yield auth_1.default.createToken(response._id.toString());
                    console.log(response._id.toString());
                    return { message: "User must fill documents", token };
                }
            }
            return "User not registered";
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
        const newUserData = {
            name,
            email,
            mobile,
            password: hashedPassword,
            referral_code: referral_code,
        };
        const response = yield userRepository_1.default.saveUser(newUserData);
        return response;
    }),
    identification_update: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, chooseID, enterID, file } = userData;
        try {
            const imageUrl = yield (0, awsS3_1.default)(file);
            const newUserData = {
                userId,
                chooseID,
                enterID,
                imageUrl
            };
            console.log(newUserData, "newuserdattaaa");
            const response = yield userRepository_1.default.updateIdentification(newUserData);
            if (response === null || response === void 0 ? void 0 : response.email)
                return ({ message: "Success" });
            else
                return ({ message: "Couldn't update now. Try again later!" });
        }
        catch (error) {
            return error;
        }
    }),
    userimage_update: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, file } = userData;
            const imageUrl = yield (0, awsS3_1.default)(file);
            const newUserData = {
                userId,
                imageUrl
            };
            const response = yield userRepository_1.default.updateUserImage(newUserData);
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
