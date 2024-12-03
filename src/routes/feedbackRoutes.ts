import { Router } from 'express';
import { createFeedback, getFeedbacks } from '../controllers/feedbackController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Gửi phản hồi (cần xác thực)
router.post('/create', authenticateToken, createFeedback);

// Lấy danh sách phản hồi
router.get('/', getFeedbacks);

export default router;
