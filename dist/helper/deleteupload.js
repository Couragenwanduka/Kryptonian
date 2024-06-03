"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteuploadedFiles = (file) => {
    const filePath = path_1.default.join(file.destination, file.filename);
    console.log(filePath);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error('Failed to delete the file:', err);
        }
    });
};
exports.default = deleteuploadedFiles;
