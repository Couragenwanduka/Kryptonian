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
exports.sendApiKey = exports.sendOtp = exports.sendConfirmationMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: 465, // Default port is 465 for SMTPS
    secure: true, // Set to true for SMTPS (port 465)
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendConfirmationMail = (email, confirmationLink) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: 'Hello Kryptonian',
            html: `
        <p>Hello,</p>
        <p>Please click the following link to confirm your email address:</p>
        <button><a href="${confirmationLink}">Click to verify</a></button>
      `,
        });
        return info;
    }
    catch (error) {
        console.error('Error sending confirmation mail:', error);
        return false;
    }
});
exports.sendConfirmationMail = sendConfirmationMail;
const sendOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: process.env.FROM_ADDRESS,
            to: email,
            subject: 'Hello Kryptonian',
            text: `Your OTP is: ${otp}`,
        });
        return info;
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
});
exports.sendOtp = sendOtp;
const sendApiKey = (email, apikey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const info = yield transporter.sendMail({
            from: process.env.FROM_ADDRESS,
            to: email,
            subject: 'Hello Kryptonian',
            text: `Your API KEY is: ${apikey}  Keep it secure and you can not generate another`,
        });
        return info;
    }
    catch (error) {
        console.error('Error sending OTP:', error);
        return false;
    }
});
exports.sendApiKey = sendApiKey;
