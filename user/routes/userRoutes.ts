import { Router } from 'express';
import { registerUser, uploadAvatar, verifyOtp } from '../controllers/userController';
import multerConfig from '../../middleware/multer';
import { authenticateUser } from '../../middleware/authentication';

const router = Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/upload-avatar', authenticateUser, multerConfig, uploadAvatar);

export default router;
