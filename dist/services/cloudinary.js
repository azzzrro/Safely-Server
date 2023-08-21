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
const cloudinaryConfig_1 = __importDefault(require("../config/cloudinaryConfig"));
exports.default = {
    uploadImage: (image) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("insideee clouddddd");
        try {
            const result = yield cloudinaryConfig_1.default.uploader.upload(image, {
                folder: "User-Identification"
            });
            console.log(result, "cloudinaryyyy");
            return result;
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(error.message);
        }
    })
};
