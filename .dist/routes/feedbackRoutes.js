"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const feedbackController_1 = require("../controllers/feedbackController");
const router = (0, express_1.Router)();
// Gửi phản hồi (cần xác thực)
// router.post('/', authenticateToken, createFeedback);
// Lấy danh sách phản hồi
router.get('/', feedbackController_1.getFeedbacks);
exports.default = router;
