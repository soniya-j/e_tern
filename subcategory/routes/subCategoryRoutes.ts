import { Router } from 'express';
import {
  getSubCategories,
  getSubCategoriesByCategoryId,
  createSubCategory,
  updateSubCategory,
} from '../controllers/subCategoryController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getSubCategoryByCategoryIdValidation,
  subCategoryCreateValidation,
  subCategoryUpdateValidation,
} from '../requests/subCategoryRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', authenticateAdmin, getSubCategories);
router.get(
  '/by-category/:categoryId/:type',
  authenticateUser,
  getSubCategoryByCategoryIdValidation,
  getSubCategoriesByCategoryId,
);
router.post('/', authenticateAdmin, subCategoryCreateValidation, createSubCategory);
router.put(
  '/:id',
  authenticateAdmin,
  subCategoryUpdateValidation,
  subCategoryCreateValidation,
  updateSubCategory,
);

export default router;
