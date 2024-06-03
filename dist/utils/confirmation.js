"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomString = exports.generateOtpCode = exports.confirmCode = void 0;
const confirmCode = () => {
    // Generate a random number between 100000 and 500000
    const code = Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000;
    return code.toString(); // Convert to string for easier handling
};
exports.confirmCode = confirmCode;
const generateOtpCode = () => {
    const code = Math.floor(Math.random() * (600000 - 200000 + 1)) + 100000;
    return code.toString(); // Convert to string for easier handling
};
exports.generateOtpCode = generateOtpCode;
const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generateRandomString = generateRandomString;
