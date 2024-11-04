import { Router } from 'express';
import { getStudentsByUserId } from '../controllers/studentController';
import { authenticateUser } from '../../middleware/authentication';
import { getStudentsByUserIdValidation } from '../requests/studentRequest';

const router = Router();
router.get('/all', authenticateUser, getStudentsByUserId);

export default router;
