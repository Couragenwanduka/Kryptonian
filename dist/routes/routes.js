"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("../controller/user.controller"));
const auth_1 = __importDefault(require("../middleware/auth"));
const file_controller_1 = __importDefault(require("../controller/file.controller"));
const multer_1 = __importDefault(require("../middleware/multer"));
const verification_1 = __importDefault(require("../middleware/verification"));
const router = (0, express_1.Router)();
router.post('/register', user_controller_1.default.createUser);
router.post('/login', auth_1.default, user_controller_1.default.login);
router.post('/sendOtp', user_controller_1.default.confirmCode);
router.get('/confirmEmail', user_controller_1.default.confirmEmail);
router.get('/apikey/:email', user_controller_1.default.createApiKey);
router.get('/getimages', file_controller_1.default.getFiles);
router.post('/upload', verification_1.default, multer_1.default.single('file'), file_controller_1.default.uploadFile);
router.patch('/deactivate', verification_1.default, file_controller_1.default.deactivateApiKey);
exports.default = router;
