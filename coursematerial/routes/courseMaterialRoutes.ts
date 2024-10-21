import { Router } from 'express';
import {
  getCourseMaterials,
  getCourseMaterialsBySubCategoryId,
} from '../controllers/courseMaterialController';
//import { authenticateUser } from '../../middleware/authentication';
import { getCourseMaterialBySubCategoryIdValidation } from '../requests/courseMaterialRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getCourseMaterials);
router.get(
  '/by-subcategory/:subCategoryId',
  getCourseMaterialBySubCategoryIdValidation,
  getCourseMaterialsBySubCategoryId,
);

export default router;
