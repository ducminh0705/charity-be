import { Router } from 'express';
import { registerUser, verifyOTP, loginUser, refreshToken, getCurrentUser, registerCharityOrg } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { verifyCharityOrg } from '../controllers/charityOrganizationController';

const router = Router();

router.post('/register', registerUser);
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

router.post('/verify-otp', verifyOTP);
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

router.post('/register/charity-org', registerCharityOrg);
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

router.patch('/verify/:organizationID', authenticateToken, verifyCharityOrg);
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

router.post('/login', loginUser);
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
router.post('/refresh-token', refreshToken);

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
router.get('/me', authenticateToken, getCurrentUser);

export default router;
