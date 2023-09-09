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
const login_1 = __importDefault(require("../../../usecases/driverUseCases/login"));
exports.default = {
    loginDriverCheck: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { mobile } = req.body;
        try {
            const response = yield login_1.default.loginCheckDriver(mobile);
            res.json(response);
        }
        catch (error) {
            res.json(error.message);
        }
    }),
    GoogleLoginDriverCheck: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email } = req.body;
        try {
            const response = yield login_1.default.GoogleLoginCheckDriver(email);
            res.json(response);
        }
        catch (error) {
            res.json(error.message);
        }
    }),
};
