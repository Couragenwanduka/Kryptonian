import {Router} from 'express';
import usercontroller from '../controller/user.controller';
import isVerified from '../middleware/auth';
import filecontroller from '../controller/file.controller';
import upload from '../middleware/multer';
import verifyApiKey from '../middleware/verification'

const router = Router();

router.post('/register', usercontroller.createUser);

router.post('/login', isVerified,usercontroller.login);

router.post('/sendOtp', usercontroller.confirmCode);

router.get('/confirmEmail', usercontroller.confirmEmail);

router.get('/apikey/:email', usercontroller.createApiKey)

router.post('/upload',verifyApiKey, upload.single('file'), filecontroller.uploadFile);

export default router;

