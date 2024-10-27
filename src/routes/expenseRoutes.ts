import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { createExpense } from '../controllers/expenseController';

const router = Router();

/**
 * @swagger
 * /expenses/create:
 *   post:
 *     summary: Tạo một chi tiêu mới
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: ID của chiến dịch từ thiện
 *               amount:
 *                 type: number
 *                 description: Số tiền chi tiêu
 *               description:
 *                 type: string
 *                 description: Mô tả chi tiêu
 *             required:
 *               - campaignId
 *               - amount
 *               - description
 *     responses:
 *       201:
 *         description: Ghi nhận chi tiêu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 expense:
 *       400:
 *         description: Số dư không đủ để chi tiêu số tiền này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Bạn không có quyền thực hiện hành động này
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Chiến dịch không tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Đã xảy ra lỗi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/create', authenticateToken, createExpense);


export default router;
