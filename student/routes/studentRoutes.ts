import { Router } from 'express';
import {
  getStudentsByUserId,
  addStudent,
  updateStudent,
  getStudents,
  getStudentByIdAdmin,
  exportStudent,
  studentSubscriptions,
} from '../controllers/studentController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import { studentAddValidation, studentUpdateValidation } from '../requests/studentRequest';
//import { getStudentById } from '../repos/studentRepo';

const router = Router();
router.get('/all', authenticateUser, getStudentsByUserId);
router.post('/addStudent', authenticateUser, studentAddValidation, addStudent);
router.put('/updateStudent/:studentId', authenticateUser, studentUpdateValidation, updateStudent);
//Admin panel Apis
router.get('/allAdmin', getStudents);
router.get('/export-students', authenticateAdmin, exportStudent);
router.get('/dashboard/subscriptions', authenticateAdmin, studentSubscriptions);

router.get('/:id', authenticateAdmin, getStudentByIdAdmin);

export default router;
