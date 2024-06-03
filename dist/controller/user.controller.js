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
const dotenv_1 = __importDefault(require("dotenv"));
const user_service_1 = __importDefault(require("../service/user.service"));
const yup_1 = require("../config/yup");
const nodemailer_1 = require("../config/nodemailer");
const confirmation_1 = require("../utils/confirmation");
const bcrypt_1 = require("../config/bcrypt");
const redis_1 = require("redis");
dotenv_1.default.config();
const redisClient = (0, redis_1.createClient)({
    password: process.env.redisPassword,
    socket: {
        host: process.env.redisHost,
        port: 13778
    }
});
redisClient.on('connect', () => {
    console.log('redis connected');
});
redisClient.on('error', (err) => {
    console.log('redis error', err);
});
redisClient.connect();
class UserController {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const vaild = yield (0, yup_1.validateUser)(name, email, password);
                if (vaild !== true)
                    return res.status(403).json({ message: vaild.errors });
                const existingUser = yield user_service_1.default.findUserByEmail(email);
                if (existingUser)
                    return res.status(409).json({ message: 'user already exist' });
                const confirm = (0, confirmation_1.confirmCode)();
                const link = `https://kryptonian-2.onrender.com/confirmEmail?token=${confirm}&email=${email}`;
                const sendmail = yield (0, nodemailer_1.sendConfirmationMail)(email, link);
                if (!sendmail)
                    return res.status(400).json({ message: 'email did send' });
                const payload = {
                    confirm: confirm,
                    email: email
                };
                redisClient.set(`${email}+confirm`, JSON.stringify(payload));
                const saveUser = yield user_service_1.default.createUser(name, email, password);
                res.status(201).json({ message: 'user created successfully', userservice: saveUser });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    confirmCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (email === ' ')
                    return res.status(400).json({ message: 'email is required' });
                const findUser = yield user_service_1.default.findUserByEmail(email);
                if (!findUser)
                    return res.status(404).json({ message: 'user not found' });
                const otp = (0, confirmation_1.generateOtpCode)();
                const sentMail = yield (0, nodemailer_1.sendOtp)(email, otp);
                if (!sentMail)
                    return res.status(400).json({ message: 'email did not send' });
                const payload = {
                    email: email,
                    otp: otp,
                    time: Date.now()
                };
                const secret = process.env.jwtSecret;
                const token = jsonwebtoken_1.default.sign({ findUser }, secret || 'secret', { expiresIn: '1h' });
                redisClient.set(email, JSON.stringify(payload));
                res.status(200).json({ message: 'Otp sent successfully', token: token });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, otp } = req.body;
                const valid = yield (0, yup_1.validateLogin)(email, password, otp);
                if (valid !== true)
                    return res.status(403).json({ message: valid.errors });
                const data = yield redisClient.get(email);
                if (!data)
                    return res.status(404).json({ message: 'user not found' });
                const payload = JSON.parse(data);
                if (payload.email !== email)
                    return res.status(200).json({ message: 'invalid email' });
                if (payload.otp !== otp)
                    return res.status(200).json({ message: 'invalid otp' });
                const time = Date.now();
                if (time - payload.time > 300000)
                    return res.status(403).json({ message: 'otp expired' });
                redisClient.del(email);
                const user = yield user_service_1.default.findUserByEmail(email);
                if (!user)
                    return res.status(404).json({ message: 'user not found' });
                const match = yield (0, bcrypt_1.comparePassword)(password, user.password);
                if (!match)
                    return res.status(403).json({ message: 'password did not match' });
                res.status(200).json({ message: 'user login successful' });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    confirmEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, email } = req.query;
                if (!token)
                    return res.status(401).json({ message: ' token is required' });
                if (!email)
                    return res.status(401).json({ message: ' email is required' });
                const data = yield redisClient.get(`${email}+confirm`);
                if (!data)
                    return res.status(404).json({ message: 'user not found' });
                const payload = JSON.parse(data);
                if (token !== payload.confirm)
                    return res.status(400).json({ message: ' token has been tampered with ' });
                yield user_service_1.default.verifyEmail(payload.email);
                redisClient.del(`${email}+confirm`);
                res.status(200).json({ message: 'email verified' });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    createApiKey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                if (!email)
                    return res.status(404).json({ message: 'please enter a valid email ' });
                const user = yield user_service_1.default.findUserByEmail(email);
                if (!user)
                    return res.status(404).json({ message: 'user not found' });
                if (user.isConfirmed === false)
                    return res.status(404).json({ message: ' Please confirm your email' });
                if (user.apiKey !== null)
                    return res.status(400).json({ message: ' user already has an API key' });
                const apiKey = (0, confirmation_1.generateRandomString)();
                if (!apiKey)
                    return res.status(404).json({ message: ' api key not available' });
                yield user_service_1.default.addApiKey(apiKey, email);
                const sendmail = yield (0, nodemailer_1.sendApiKey)(email, apiKey);
                if (!sendmail)
                    return res.status(400).json({ message: 'email did not send' });
                res.status(200).json({ message: 'api key created successfully' });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
}
const usercontroller = new UserController();
exports.default = usercontroller;
