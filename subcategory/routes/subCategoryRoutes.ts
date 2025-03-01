import { Router } from 'express';
import {
  getSubCategories,
  getSubCategoriesByCategoryId,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategoryIdAdmin,
  getSubCategoriesById,
} from '../controllers/subCategoryController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getSubCategoryByCategoryIdValidation,
  subCategoryCreateValidation,
  subCategoryUpdateValidation,
} from '../requests/subCategoryRequest';
import multerConfig from '../../middleware/multer';

const router = Router();

router.get('/all', authenticateAdmin, getSubCategories);
router.get(
  '/by-category/:categoryId/:type',
  authenticateUser,
  getSubCategoryByCategoryIdValidation,
  getSubCategoriesByCategoryId,
);
router.post('/', authenticateAdmin, multerConfig, subCategoryCreateValidation, createSubCategory);
router.put(
  '/:id',
  authenticateAdmin,
  multerConfig,
  subCategoryUpdateValidation,
  subCategoryCreateValidation,
  updateSubCategory,
);
router.delete(
  '/:id',
  authenticateAdmin,
  multerConfig,
  subCategoryUpdateValidation,
  deleteSubCategory,
);
router.get(
  '/by-categoryAdmin/:categoryId/:type',
  authenticateAdmin,
  getSubCategoryByCategoryIdValidation,
  getSubCategoriesByCategoryIdAdmin,
);
router.get('/:id', authenticateAdmin, subCategoryUpdateValidation, getSubCategoriesById);

export default router;
