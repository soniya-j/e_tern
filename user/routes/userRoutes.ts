import { Router } from 'express';
import {
  registerUser,
  uploadAvatar,
  verifyOtp,
  sendOtp,
  getProfile,
  courseMaterialTrack,
  updateProfile,
  getUsers,
  login,
  registerAdmin,
  updateParentDob,
  verifyParentDob,
  switchStudent,
  logout,
} from '../controllers/userController';
import multerConfig from '../../middleware/multer';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  userRegisterValidation,
  verifyOtpValidation,
  sendOtpValidation,
  getProfileValidation,
  courseMaterialTrackValidation,
  userUpdateValidation,
  loginValidation,
  adminRegisterValidation,
  userDobValidation,
  userDobVerifyValidation,
  switchStudentValidation,
  logoutValidation,
} from '../requests/userRequest';

const router = Router();

router.post('/register', userRegisterValidation, registerUser);
router.post('/verify-otp', verifyOtpValidation, verifyOtp);
router.post('/upload-avatar', authenticateUser, multerConfig, uploadAvatar);
router.post('/send-otp', sendOtpValidation, sendOtp);
router.get('/profile/:userId', authenticateUser, getProfileValidation, getProfile);
router.get(
  '/coursematerial-track/:userId',
  authenticateUser,
  courseMaterialTrackValidation,
  courseMaterialTrack,
);
router.put('/profile-update/:userId', authenticateUser, userUpdateValidation, updateProfile);
router.put('/parentdob-update/:userId', authenticateUser, userDobValidation, updateParentDob);
router.post('/parentdob-verify', authenticateUser, userDobVerifyValidation, verifyParentDob);
router.get('/switch-student/:studentId', authenticateUser, switchStudentValidation, switchStudent);
router.post('/logout', authenticateUser, logoutValidation, logout);

//Admin apis
// GET /api/user/all?fullName=Juan&subscribed=true&status=1&limit=5&page=2 //all optional
router.post('/login', loginValidation, login);
router.get('/all', authenticateAdmin, getUsers);
router.post('/register-admin', adminRegisterValidation, registerAdmin);

export default router;
