import { Router } from 'express';
import {
  subscription,
  addOfflinePayment,
  getOfflinePayments,
  getSubscriptionById,
  getRevenueDetails,
} from '../controllers/subscriptionController';
import { authenticateUser, authenticateAdmin } from '../../middleware/authentication';
import {
  subscriptionValidation,
  offlinePaymentValidation,
  subscriptionIdValidation,
} from '../requests/subscriptionRequest';
import multerConfig from '../../middleware/multer';

const router = Router();
router.post('/', authenticateUser, subscriptionValidation, subscription);
router.post(
  '/add-offline-payment',
  authenticateAdmin,
  multerConfig,
  offlinePaymentValidation,
  addOfflinePayment,
);
router.get('/offlinepayments', authenticateAdmin, getOfflinePayments);
router.get('/revenueDetails', authenticateAdmin, getRevenueDetails);
router.get('/:id', authenticateAdmin, subscriptionIdValidation, getSubscriptionById);

export default router;
