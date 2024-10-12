import { Router } from 'express';
import { createDonation, handleStripeWebhook } from '../controllers/donationController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// /**
//  * @swagger
//  * /donations:
//  *   post:
//  *     summary: Create a new donation
//  *     tags: [Donation]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/Donation'
//  *     responses:
//  *       200:
//  *         description: A donation object
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Donation'
//  *       400:
//  *         description: Bad request
//  */
// router.post('/', authenticateToken, createDonation);

// Stripe Webhook
// router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
