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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = {
    createToken: (clientId) => __awaiter(void 0, void 0, void 0, function* () {
        const jwtSecretKey = "t9rXw5bF2mS7zQ8p";
        const token = jsonwebtoken_1.default.sign({ clientId }, jwtSecretKey);
        return token;
    }),
    verifyToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim().split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
        }
        else {
            try {
                const jwtSecretKey = "t9rXw5bF2mS7zQ8p";
                const decodedToken = jsonwebtoken_1.default.verify(token, jwtSecretKey);
                req.clientId = decodedToken.clientId;
                next();
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
    }),
};
