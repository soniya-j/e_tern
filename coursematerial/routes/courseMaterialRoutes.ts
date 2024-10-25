import { Router } from 'express';
import {
  getCourseMaterials,
  getCourseMaterialsBySubCategoryId,
  trackCourseMaterialView,
} from '../controllers/courseMaterialController';
//import { authenticateUser } from '../../middleware/authentication';
import {
  getCourseMaterialBySubCategoryIdValidation,
  trackCourseMaterialValidation,
} from '../requests/courseMaterialRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getCourseMaterials);
router.get(
  '/by-subcategory/:subCategoryId',
  getCourseMaterialBySubCategoryIdValidation,
  getCourseMaterialsBySubCategoryId,
);

router.post('/track-view', trackCourseMaterialValidation, trackCourseMaterialView);

export default router;
