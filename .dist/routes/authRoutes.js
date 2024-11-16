"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const charityOrganizationController_1 = require("../controllers/charityOrganizationController");
const sms_1 = require("../utils/sms");
const router = (0, express_1.Router)();
router.post('/register', authController_1.registerUser);
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.get('/sendOTP', sms_1.sendOTP);
router.get('/verifyOTP', sms_1.verifyOTP);
router.post('/verify-otp', sms_1.verifyOTP);
/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 */
router.post('/register/charity-org', authController_1.registerCharityOrg);
/**
 * @swagger
 * /register/charity-org:
 *   post:
 *     summary: Register a new charity organization
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *               organizationName:
 *                 type: string
 *               licenseDocument:
 *                 type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Charity organization registered successfully
 *       400:
 *         description: Bad request
 */
router.patch('/verify/:organizationID', auth_1.authenticateToken, charityOrganizationController_1.verifyCharityOrg);
/**
 * @swagger
 * /verify/{organizationID}:
 *   patch:
 *     summary: Verify a charity organization
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationID
 *         required: true
 *         schema:
 *           type: integer
 *         description: Charity organization ID
 *     responses:
 *       200:
 *         description: Charity organization verified successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post('/login', authController_1.loginUser);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/refresh-token', authController_1.refreshToken);
/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user retrieved successfully
 *       400:
 *         description: Bad request
 */
router.get('/me', auth_1.authenticateToken, authController_1.getCurrentUser);
exports.default = router;
