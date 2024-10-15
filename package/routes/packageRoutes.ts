import { Router } from 'express';
import { getAllPackages } from '../controllers/packageController';
//import { authenticateUser } from '../../middleware/authentication';

const router = Router();

//router.get('/all', authenticateUser, getAllPackages);
router.get('/all', getAllPackages);

export default router;
