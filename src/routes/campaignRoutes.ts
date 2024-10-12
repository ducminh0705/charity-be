import { Router } from 'express';
import { getCampaigns, getCampaignById } from '../controllers/campaignController';

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

export default router;
