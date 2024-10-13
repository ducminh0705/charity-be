import { Router } from 'express';
import {
  createCampaign,
  updateCampaign,
  getCampaigns,
  getCampaignById,
  deleteCampaign,
  updateCampaignStatus,
} from '../controllers/campaignController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Get all campaigns
 *     tags: [Campaign]
 *     responses:
 *       200:
 *         description: An array of campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 */
router.get('/', getCampaigns);
// router.get('/:id', getCampaignById);

// Tạo chiến dịch mới (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaign]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCampaignRequest'
 *     responses:
 *       200:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateToken, createCampaign);

// Cập nhật chiến dịch (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Update a campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCampaignRequest'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/:id', authenticateToken, updateCampaign);

// Xóa chiến dịch (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Delete a campaign
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       204:
 *         description: No content
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', authenticateToken, deleteCampaign);

// Cập nhật trạng thái chiến dịch (chỉ dành cho admin)
/**
 * @swagger
 * /campaigns/{id}/status:
 *   patch:
 *     summary: Update campaign status
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCampaignStatusRequest'
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.patch('/:id/status', authenticateToken, updateCampaignStatus);

// Lấy thông tin chiến dịch theo ID
// generate swagger for this route
/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Get campaign by ID
 *     tags: [Campaign]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Campaign ID
 *     responses:
 *       200:
 *         description: Campaign found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Campaign not found
 */
router.get('/:id', getCampaignById);

export default router;
