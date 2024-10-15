import { Router } from 'express';
import { getCategories } from '../controllers/categoryController';
//import { authenticateUser } from '../../middleware/authentication';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getCategories);

export default router;
