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
 *     summary: Liệt kê tất cả các chiến dịch từ thiện
 *     description: Liệt kê tất cả các chiến dịch từ thiện với filter theo trạng thái và tổ chức từ thiện
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter chiến dịch theo trạng thái
 *       - in: query
 *         name: charityOrgId
 *         schema:
 *           type: string
 *         description: Filter chiến dịch theo tổ chức từ thiện
 *     responses:
 *       200:
 *         description: A list of charity campaigns
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The campaign ID
 *                   name:
 *                     type: string
 *                     description: The campaign name
 *                   status:
 *                     type: string
 *                     description: The campaign status
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: The creation date of the campaign
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: The last update date of the campaign
 *                   Location:
 *                     type: object
 *                     description: The location associated with the campaign
 *                   CharityOrganization:
 *                     type: object
 *                     description: The charity organization associated with the campaign
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The organization ID
 *                       name:
 *                         type: string
 *                         description: The organization name
 *                       User:
 *                         type: object
 *                         description: The user associated with the organization
 *                         properties:
 *                           id:
 *                             type: string
 *                             description: The user ID
 *                           firstName:
 *                             type: string
 *                             description: The user's first name
 *                           lastName:
 *                             type: string
 *                             description: The user's last name
 *                           email:
 *                             type: string
 *                             description: The user's email
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */
router.get('/', getCampaigns);

// Tạo chiến dịch mới (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns/create:
 *   post:
 *     summary: Tạo một chiến dịch từ thiện mới
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - goalAmount
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của chiến dịch
 *               description:
 *                 type: string
 *                 description: Mô tả của chiến dịch
 *               goalAmount:
 *                 type: number
 *                 description: Số tiền mục tiêu của chiến dịch
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày bắt đầu chiến dịch
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Ngày kết thúc chiến dịch
 *               charityOrgId:
 *                 type: integer
 *                 description: ID của tổ chức từ thiện (chỉ dành cho admin)
 *               locations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: Tên địa điểm
 *                     latitude:
 *                       type: number
 *                       description: Vĩ độ của địa điểm
 *                     longitude:
 *                       type: number
 *                       description: Kinh độ của địa điểm
 *                     damageLevel:
 *                       type: string
 *                       description: Mức độ thiệt hại của địa điểm
 *                     needsHelp:
 *                       type: boolean
 *                       description: Địa điểm có cần giúp đỡ hay không
 *                     ward:
 *                       type: string
 *                       description: Phường của địa điểm
 *                     district:
 *                       type: string
 *                       description: Quận của địa điểm
 *                     province:
 *                       type: string
 *                       description: Tỉnh của địa điểm
 *                     city:
 *                       type: string
 *                       description: Thành phố của địa điểm
 *                     goalAmount:
 *                       type: number
 *                       description: Số tiền mục tiêu cho địa điểm
 *     responses:
 *       201:
 *         description: Chiến dịch được tạo thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được ủy quyền
 *       403:
 *         description: Không được phép
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/create', authenticateToken, createCampaign);

// Cập nhật chiến dịch (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns/update/{id}:
 *   put:
 *     summary: Cập nhật thông tin chiến dịch
 *     tags: [Campaign]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của chiến dịch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của chiến dịch
 *               description:
 *                 type: string
 *                 description: Mô tả của chiến dịch
 *               goalAmount:
 *                 type: number
 *                 description: Số tiền mục tiêu của chiến dịch
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày bắt đầu của chiến dịch
 *               endDate:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày kết thúc của chiến dịch
 *               status:
 *                 type: string
 *                 description: Trạng thái của chiến dịch
 *                 enum: [pending, active, completed, cancelled]
 *               locations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID của địa điểm
 *                     name:
 *                       type: string
 *                       description: Tên của địa điểm
 *                     latitude:
 *                       type: number
 *                       description: Vĩ độ của địa điểm
 *                     longitude:
 *                       type: number
 *                       description: Kinh độ của địa điểm
 *                     damageLevel:
 *                       type: string
 *                       description: Mức độ thiệt hại của địa điểm
 *                     needsHelp:
 *                       type: boolean
 *                       description: Địa điểm có cần giúp đỡ hay không
 *                     ward:
 *                       type: string
 *                       description: Phường của địa điểm
 *                     district:
 *                       type: string
 *                       description: Quận của địa điểm
 *                     province:
 *                       type: string
 *                       description: Tỉnh của địa điểm
 *                     city:
 *                       type: string
 *                       description: Thành phố của địa điểm
 *                     goalAmount:
 *                       type: number
 *                       description: Số tiền mục tiêu của địa điểm
 *     responses:
 *       200:
 *         description: Cập nhật chiến dịch thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 campaign:
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Không được ủy quyền
 *       403:
 *         description: Không được phép
 *       404:
 *         description: Không tìm thấy chiến dịch
 *       500:
 *         description: Lỗi máy chủ
 */
router.put('/update/:id', authenticateToken, updateCampaign);

// Xóa chiến dịch (chỉ dành cho charity_org và admin)
/**
 * @swagger
 * /campaigns/delete/{id}:
 *   delete:
 *     summary: Xóa một chiến dịch từ thiện
 *     description: Xóa một chiến dịch từ thiện dựa trên ID của chiến dịch. Chỉ có tổ chức từ thiện và quản trị viên mới có quyền xóa chiến dịch.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của chiến dịch cần xóa
 *     responses:
 *       200:
 *         description: Chiến dịch đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Chiến dịch đã được xóa thành công
 *       401:
 *         description: Không được uỷ quyền
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không được uỷ quyền
 *       403:
 *         description: Không được phép
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không được phép
 *       404:
 *         description: Không tìm thấy chiến dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy chiến dịch
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.delete('/delete/:id', authenticateToken, deleteCampaign);

/**
 * @swagger
 * /campaigns/update-status/{id}:
 *   put:
 *     summary: Cập nhật trạng thái của chiến dịch
 *     description: Chỉ admin mới có thể cập nhật trạng thái của chiến dịch. Các trạng thái hợp lệ bao gồm 'pending', 'active', 'completed', và 'cancelled'.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của chiến dịch cần cập nhật
 *         schema:
 *           type: string
 *       - in: body
 *         name: status
 *         required: true
 *         description: Trạng thái mới của chiến dịch
 *         schema:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [pending, active, completed, cancelled]
 *     responses:
 *       200:
 *         description: Trạng thái của chiến dịch đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 campaign:
 *       400:
 *         description: Trạng thái không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Không được ủy quyền
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Không được phép
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy chiến dịch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.patch('/update-status/:id', authenticateToken, updateCampaignStatus);

// Lấy thông tin chiến dịch theo ID
/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Retrieve a campaign by its ID
 *     description: Fetches a campaign along with its associated location and charity organization details.
 *     tags:
 *       - Campaign
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the campaign to retrieve
 *     responses:
 *       200:
 *         description: A campaign object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                   format: date-time
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                 charityOrganization:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                           email:
 *                             type: string
 *       404:
 *         description: Campaign not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không tìm thấy chiến dịch
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi máy chủ
 */
router.get('/:id', getCampaignById);

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
