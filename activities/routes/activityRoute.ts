import { Router } from 'express';
import { authenticateUser } from '../../middleware/authentication';
import { getAllActivities } from '../controllers/activityController';

const router = Router();

router.get('/all', authenticateUser, getAllActivities);

export default router;
