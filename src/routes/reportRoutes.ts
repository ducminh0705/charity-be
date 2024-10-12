import { Router } from 'express';
import { getDonationsReport } from '../controllers/reportController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.get('/donations', authenticateToken, getDonationsReport);

export default router;
