import { Router } from 'express';
import { getStudentsByUserId, addStudent, updateStudent } from '../controllers/studentController';
import { authenticateUser } from '../../middleware/authentication';
import { studentAddValidation, studentUpdateValidation } from '../requests/studentRequest';

const router = Router();
router.get('/all', authenticateUser, getStudentsByUserId);
router.post('/addStudent', authenticateUser, studentAddValidation, addStudent);
router.put('/updateStudent/:studentId', authenticateUser, studentUpdateValidation, updateStudent);

export default router;
