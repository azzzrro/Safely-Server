"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refferalCode = void 0;
const refferalCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    let randomString = "";
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters[randomIndex];
    }
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        randomString += digits[randomIndex];
    }
    return randomString;
};
exports.refferalCode = refferalCode;
