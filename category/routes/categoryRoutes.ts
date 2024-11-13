import { Router } from 'express';
import {
  getCategories,
  getCategoriesByPackageId,
  createCategory,
  updateCategory,
} from '../controllers/categoryController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getCategoryByPackageIdValidation,
  categoryCreateValidation,
  categoryUpdateValidation,
} from '../requests/categoryRequest';

const router = Router();

router.get('/all', authenticateAdmin, getCategories);
router.get(
  '/by-package/:studentId/:type',
  authenticateUser,
  getCategoryByPackageIdValidation,
  getCategoriesByPackageId,
);
router.post('/', authenticateAdmin, categoryCreateValidation, createCategory);
router.put(
  '/:id',
  authenticateAdmin,
  categoryUpdateValidation,
  categoryCreateValidation,
  updateCategory,
);

export default router;
