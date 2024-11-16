"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentInfoController_1 = require("../controllers/paymentInfoController");
const router = (0, express_1.Router)();
router.get('/', paymentInfoController_1.getPaymentInfo);
exports.default = router;
