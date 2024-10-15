import { Router } from 'express';
import { getCategories, getCategoriesByPackageId } from '../controllers/categoryController';
//import { authenticateUser } from '../../middleware/authentication';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getCategories);
router.get('/by-package/:packageId', getCategoriesByPackageId);

export default router;
