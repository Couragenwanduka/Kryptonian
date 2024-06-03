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
const user_1 = __importDefault(require("../model/user"));
const bcrypt_1 = require("../config/bcrypt");
class userService {
    constructor() {
    }
    createUser(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const passwordHash = yield (0, bcrypt_1.hashPassword)(password);
                const newUser = new user_1.default({
                    name,
                    email,
                    password: passwordHash,
                });
                const user = yield newUser.save();
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ email });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    verifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOneAndUpdate({ email }, { $set: { isConfirmed: true } }, { new: true });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    addApiKey(apiKey, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOneAndUpdate({ email }, { $set: { apiKey: apiKey } }, { new: true });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserByApiKey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ apiKey: apiKey });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    deactivateApikey(apiKey) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOneAndUpdate({ apiKey: apiKey }, { $set: { apiKey: null } }, { new: true });
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveFile(userId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }
                user.files.push(file);
                yield user.save();
                return user;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    getallfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.find();
                const files = user.flatMap(user => user.files);
                return files;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
const userservice = new userService();
exports.default = userservice;
