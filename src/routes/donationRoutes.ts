import { Router } from 'express';
import { createDonation, updateDonationStatus, getDonations } from '../controllers/donationController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /donations/create:
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
router.post('/create', authenticateToken, createDonation);

/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Retrieve a list of donations
 *     tags: [Donations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *         description: Filter donations by status
 *     responses:
 *       200:
 *         description: A list of donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, getDonations);

/**
 * @swagger
 * /donations/update-status:
 *   put:
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
router.put('/update-status', authenticateToken, updateDonationStatus);



export default router;
