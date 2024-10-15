import { Router } from 'express';
import { getAllPackages } from '../controllers/packageController';
import { authenticateUser } from '../../middleware/authentication';

const router = Router();

router.get('/all', authenticateUser, getAllPackages);

export default router;
