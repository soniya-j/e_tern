import { Router } from 'express';
import {
  getCourseMaterials,
  getCourseMaterialsBySubCategoryId,
  trackCourseMaterialView,
  createCourseMaterial,
  updateCourseMaterial,
  createCourseMaterialWatchHistory,
} from '../controllers/courseMaterialController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getCourseMaterialBySubCategoryIdValidation,
  trackCourseMaterialValidation,
  courseMaterialCreateValidation,
  courseMaterialUpdateValidation,
  courseMaterialWatchHistoryValidation,
} from '../requests/courseMaterialRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getCourseMaterials);
router.get(
  '/by-subcategory/:subCategoryId/:type/:studentId',
  authenticateUser,
  getCourseMaterialBySubCategoryIdValidation,
  getCourseMaterialsBySubCategoryId,
);

router.post(
  '/track-view',
  authenticateUser,
  trackCourseMaterialValidation,
  trackCourseMaterialView,
);
router.post(
  '/add-watch-history',
  authenticateUser,
  courseMaterialWatchHistoryValidation,
  createCourseMaterialWatchHistory,
);

router.post('/', authenticateAdmin, courseMaterialCreateValidation, createCourseMaterial);
router.put(
  '/:id',
  authenticateAdmin,
  courseMaterialUpdateValidation,
  courseMaterialCreateValidation,
  updateCourseMaterial,
);

export default router;
