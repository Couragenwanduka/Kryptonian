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
const yup_1 = require("../config/yup");
const user_service_1 = __importDefault(require("../service/user.service"));
const deleteupload_1 = __importDefault(require("../helper/deleteupload"));
const fs_1 = __importDefault(require("fs"));
class FileController {
    uploadFile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title } = req.body;
                const { apiKey } = req.query;
                const valid = yield (0, yup_1.validateFile)(title);
                if (valid !== true)
                    return res.status(403).json({ message: valid });
                const user = yield user_service_1.default.findUserByApiKey(apiKey);
                if (!user)
                    return res.status(404).json({ message: 'invalid apiKey' });
                const file = req.file;
                if (!file)
                    return res.status(400).json({ message: 'No file uploaded' });
                // Read file content as binary data
                const data = fs_1.default.readFileSync(file.path);
                // Convert binary data to Base64
                const base64Data = data.toString('base64');
                const fileData = {
                    title,
                    data: base64Data,
                    mimeType: file.mimetype,
                    size: file.size
                };
                const savedFile = yield user_service_1.default.saveFile(user._id, fileData);
                // Delete the uploaded file
                (0, deleteupload_1.default)(file);
                res.status(200).json({ message: 'File uploaded successfully', savedFile: savedFile });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error });
            }
        });
    }
    getFiles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = yield user_service_1.default.getallfiles();
                if (files === undefined)
                    return res.status(404).json({ message: "no files found" });
                const data = files.map(file => {
                    return {
                        title: file.title,
                        data: file.data,
                        mimeType: file.mimeType,
                        size: file.size
                    };
                });
                res.status(200).json({ message: 'Files retrieved successfully', files: data });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error });
            }
        });
    }
    deactivateApiKey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { apiKey } = req.query;
                console.log(apiKey);
                const user = yield user_service_1.default.findUserByApiKey(apiKey);
                console.log(user);
                if (!user)
                    return res.status(404).json({ message: 'User not found' });
                const deactivate = yield user_service_1.default.deactivateApikey(apiKey);
                if (!deactivate)
                    return res.status(404).json({ message: ' unable to deactivate apikey' });
                res.status(200).json({ message: 'Successfully deactivated' });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: error });
            }
        });
    }
}
exports.default = new FileController();
