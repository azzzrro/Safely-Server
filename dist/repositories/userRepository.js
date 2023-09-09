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
const user_1 = __importDefault(require("../entities/user"));
exports.default = {
    findUser: (mobile) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user_1.default.findOne({ mobile: mobile });
        return result;
    }),
    GoogleFindUser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield user_1.default.findOne({ email: email });
        return result;
    }),
    saveUser: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new user_1.default({
            name: userData.name,
            email: userData.email,
            mobile: userData.mobile,
            password: userData.password,
            referral_code: userData.referral_code,
        });
        try {
            const savedUser = yield newUser.save();
            return savedUser;
        }
        catch (error) {
            return error.message;
        }
    }),
    updateIdentification: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, chooseID, enterID, imageUrl } = userData;
        console.log(userData, "query dattaaaa");
        const response = yield user_1.default.findByIdAndUpdate(userId, {
            $set: {
                id_type: chooseID,
                id: enterID,
                id_image: imageUrl,
            },
        }, {
            new: true,
        });
        return response;
    }),
    updateUserImage: (userData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, imageUrl } = userData;
            const response = yield user_1.default.findByIdAndUpdate(userId, {
                $set: {
                    userImage: imageUrl,
                    identification: true,
                    account_status: "Pending"
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
