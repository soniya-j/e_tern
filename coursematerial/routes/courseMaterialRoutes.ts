import { Router } from 'express';
import {
  getCourseMaterials,
  getCourseMaterialsBySubCategoryId,
  trackCourseMaterialView,
  createCourseMaterial,
  updateCourseMaterial,
  createCourseMaterialWatchHistory,
  deleteCourseMaterial,
  getCourseMaterialsById,
  getVideoDetails,
  getTrendingVideoDetails,
} from '../controllers/courseMaterialController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  getCourseMaterialBySubCategoryIdValidation,
  trackCourseMaterialValidation,
  courseMaterialCreateValidation,
  courseMaterialUpdateValidation,
  courseMaterialWatchHistoryValidation,
} from '../requests/courseMaterialRequest';
import multerConfig from '../../middleware/multer';

const router = Router();

router.get('/all', authenticateAdmin, getCourseMaterials);
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

router.post(
  '/',
  authenticateAdmin,
  multerConfig,
  courseMaterialCreateValidation,
  createCourseMaterial,
);

router.put(
  '/:id',
  authenticateAdmin,
  multerConfig,
  courseMaterialUpdateValidation,
  courseMaterialCreateValidation,
  updateCourseMaterial,
);
router.delete('/:id', authenticateAdmin, courseMaterialUpdateValidation, deleteCourseMaterial);
router.get('/videoDetails', authenticateAdmin, getVideoDetails);
router.get('/dashboard/trendingVideoDetails', authenticateAdmin, getTrendingVideoDetails);

router.get('/:id', authenticateAdmin, courseMaterialUpdateValidation, getCourseMaterialsById);

export default router;
