import { Router } from 'express';
import {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from '../controllers/packageController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import { packageCreateValidation, packageUpdateValidation } from '../requests/packageRequest';

const router = Router();

router.get('/all', authenticateUser, getAllPackages);
router.get('/allAdmin', authenticateAdmin, getAllPackages);
router.post('/', authenticateAdmin, packageCreateValidation, createPackage);
router.put(
  '/:id',
  authenticateAdmin,
  packageUpdateValidation,
  packageCreateValidation,
  updatePackage,
);
router.delete('/:id', authenticateAdmin, packageUpdateValidation, deletePackage);
export default router;
