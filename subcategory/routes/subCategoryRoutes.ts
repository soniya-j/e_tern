import { Router } from 'express';
import {
  getSubCategories,
  getSubCategoriesByCategoryId,
} from '../controllers/subCategoryController';
//import { authenticateUser } from '../../middleware/authentication';
import { getSubCategoryByCategoryIdValidation } from '../requests/subCategoryRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getSubCategories);
router.get(
  '/by-category/:categoryId',
  getSubCategoryByCategoryIdValidation,
  getSubCategoriesByCategoryId,
);

export default router;
