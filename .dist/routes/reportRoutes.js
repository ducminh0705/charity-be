"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /donations:
 *   get:
 *     summary: Get donations report
 *     description: Retrieve a report of donations filtered by campaign ID or charity organization ID.
 *     parameters:
 *       - in: query
 *         name: campaign_id
 *         schema:
 *           type: string
 *         description: The ID of the campaign to filter donations by.
 *       - in: query
 *         name: charity_org_id
 *         schema:
 *           type: string
 *         description: The ID of the charity organization to filter donations by.
 *     responses:
 *       200:
 *         description: A list of donations.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   User:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                   CharityCampaign:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       charityOrganization:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           organizationName:
 *                             type: string
 *                           User:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               phoneNumber:
 *                                 type: string
 *       500:
 *         description: Internal server error.
 */
router.get('/donations', auth_1.authenticateToken, reportController_1.getDonationsReport);
/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get expenses report
 *     description: Retrieve a report of expenses based on campaign ID or charity organization ID.
 *     parameters:
 *       - in: query
 *         name: campaign_id
 *         schema:
 *           type: string
 *         description: ID of the campaign
 *       - in: query
 *         name: charity_org_id
 *         schema:
 *           type: string
 *         description: ID of the charity organization
 *     responses:
 *       200:
 *         description: A list of expenses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   CharityCampaign:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       charityOrganization:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           organizationName:
 *                             type: string
 *                           User:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               firstName:
 *                                 type: string
 *                               lastName:
 *                                 type: string
 *                               email:
 *                                 type: string
 *                               phoneNumber:
 *                                 type: string
 *       500:
 *         description: Internal server error
 */
router.get('/expenses', auth_1.authenticateToken, reportController_1.getExpensesReport);
exports.default = router;