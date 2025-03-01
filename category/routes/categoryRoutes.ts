import { Router } from 'express';
import {
  getCategories,
  getCategoriesByPackageId,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesById,
} from '../controllers/categoryController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getCategoryByPackageIdValidation,
  categoryCreateValidation,
  categoryUpdateValidation,
} from '../requests/categoryRequest';
import multerConfig from '../../middleware/multer';

const router = Router();

router.get('/all', authenticateAdmin, getCategories);
router.get(
  '/by-package/:studentId/:type',
  authenticateUser,
  getCategoryByPackageIdValidation,
  getCategoriesByPackageId,
);
router.post('/', authenticateAdmin, multerConfig, categoryCreateValidation, createCategory);
router.put(
  '/:id',
  authenticateAdmin,
  multerConfig,
  categoryUpdateValidation,
  categoryCreateValidation,
  updateCategory,
);
router.delete('/:id', authenticateAdmin, categoryUpdateValidation, deleteCategory);
router.get('/:id', authenticateAdmin, categoryUpdateValidation, getCategoriesById);

export default router;
