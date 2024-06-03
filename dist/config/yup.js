"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFile = exports.validateUser = exports.validateLogin = void 0;
const Yup = __importStar(require("yup"));
const schema = Yup.object().shape({
    name: Yup.string().required('please Provide a name'),
    email: Yup.string().email('invaild email').required('please provide an email address'),
    password: Yup.string().min(6, 'password must be more than 6 characters').required('please provide a password'),
});
const login = Yup.object().shape({
    email: Yup.string().email('invaild email').required('please provide an email address'),
    password: Yup.string().min(6, 'password must be more than 6 characters').required('please provide a password'),
    otp: Yup.string().required('please provide an otp   ')
});
const file = Yup.object().shape({
    title: Yup.string().required('please provide a title').max(100, 'title must be less than 100 characters')
});
const validateLogin = (email, password, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield login.validate({ email, password, otp }, { abortEarly: false });
        return true;
    }
    catch (error) {
        return error.errors;
    }
});
exports.validateLogin = validateLogin;
const validateUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield schema.validate({ name, email, password }, { abortEarly: false });
        return true;
    }
    catch (error) {
        return error.errors;
    }
});
exports.validateUser = validateUser;
const validateFile = (title) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield file.validate({ title }, { abortEarly: false });
        return true;
    }
    catch (error) {
        return error.errors;
    }
});
exports.validateFile = validateFile;
