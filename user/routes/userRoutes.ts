import { Router } from 'express';
import {
  registerUser,
  uploadAvatar,
  verifyOtp,
  sendOtp,
  getProfile,
  courseMaterialTrack,
  updateProfile,
} from '../controllers/userController';
import multerConfig from '../../middleware/multer';
import { authenticateUser } from '../../middleware/authentication';
import {
  userRegisterValidation,
  verifyOtpValidation,
  sendOtpValidation,
  getProfileValidation,
  courseMaterialTrackValidation,
  userUpdateValidation,
} from '../requests/userRequest';

const router = Router();

router.post('/register', userRegisterValidation, registerUser);
router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/upload-avatar', authenticateUser, multerConfig, uploadAvatar);
router.post('/send-otp', sendOtpValidation, sendOtp);
router.get('/profile/:userId', getProfileValidation, getProfile);
router.get('/courseMaterialTrack/:userId', courseMaterialTrackValidation, courseMaterialTrack);
router.put('/profileUpdate/:userId', userUpdateValidation, updateProfile);
export default router;
