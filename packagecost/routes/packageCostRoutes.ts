import { Router } from 'express';
import { getPackageCosts, getPackageCostsByPackageId } from '../controllers/packageCostController';
//import { authenticateUser } from '../../middleware/authentication';
import { getPackageCostByPackageIdValidation } from '../requests/packageCostRequest';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getPackageCosts);
router.get(
  '/by-package/:packageId',
  getPackageCostByPackageIdValidation,
  getPackageCostsByPackageId,
);

export default router;
