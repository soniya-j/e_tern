import { Router } from 'express';
import { getPackageCosts, getPackageCostsByPackageId } from '../controllers/packageCostController';
//import { authenticateUser } from '../../middleware/authentication';

const router = Router();

//router.get('/all', authenticateUser, getCategories);
router.get('/all', getPackageCosts);
router.get('/by-package/:packageId', getPackageCostsByPackageId);

export default router;
