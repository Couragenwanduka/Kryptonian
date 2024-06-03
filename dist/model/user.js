"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    data: {
        type: Buffer,
    },
    mimeType: {
        type: String,
    },
    size: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isConfirmed: {
        type: Boolean,
        default: false,
    },
    apiKey: {
        type: String,
        default: null,
    },
    files: {
        type: [fileSchema],
        default: [],
    },
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
