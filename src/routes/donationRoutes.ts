import { Router } from 'express';
import { createDonation, getPendingDonation, updateDonationStatus } from '../controllers/donationController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /donations:
 *   post:
 *     summary: Tạo một khoản quyên góp mới
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               campaignId:
 *                 type: integer
 *                 description: ID của chiến dịch
 *               locationId:
 *                 type: integer
 *                 description: ID của địa điểm
 *               amount:
 *                 type: number
 *                 description: Số tiền quyên góp
 *               method:
 *                 type: string
 *                 description: Phương thức quyên góp
 *     responses:
 *       201:
 *         description: Tạo khoản quyên góp thành công
 *       404:
 *         description: Chiến dịch không tồn tại
 *       500:
 *         description: Đã xảy ra lỗi
 */
router.post('/', authenticateToken, createDonation);

/**
 * @swagger
 * /donations/pending:
 *   get:
 *     summary: Retrieve all pending donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pending donations
 *         content:
 *           application/json:
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, getPendingDonation);

/**
 * @swagger
 * /donations/status:
 *   patch:
 *     summary: Cập nhật trạng thái của khoản quyên góp
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donationId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [completed, failed]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Trạng thái không hợp lệ
 *       403:
 *         description: Bạn không có quyền truy cập
 *       404:
 *         description: Donation không tồn tại
 *       500:
 *         description: Đã xảy ra lỗi
 */
router.put('/', authenticateToken, updateDonationStatus);



export default router;
