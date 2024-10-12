import { Router } from 'express';
import { getPaymentInfo } from '../controllers/paymentInfoController';

const router = Router();

router.get('/', getPaymentInfo);

export default router;
