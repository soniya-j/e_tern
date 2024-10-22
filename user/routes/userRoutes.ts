import { Router } from 'express';
import {
  registerUser,
  uploadAvatar,
  verifyOtp,
  sendOtp,
  getProfile,
} from '../controllers/userController';
import multerConfig from '../../middleware/multer';
import { authenticateUser } from '../../middleware/authentication';
import {
  userRegisterValidation,
  verifyOtpValidation,
  sendOtpValidation,
  getProfileValidation,
} from '../requests/userRequest';

const router = Router();

router.post('/register', userRegisterValidation, registerUser);
router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/upload-avatar', authenticateUser, multerConfig, uploadAvatar);
router.post('/send-otp', sendOtpValidation, sendOtp);
router.get('/profile/:userId', getProfileValidation, getProfile);

export default router;
