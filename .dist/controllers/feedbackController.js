"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeedbacks = exports.createFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const User_1 = __importDefault(require("../models/User"));
const CharityCampaign_1 = __importDefault(require("../models/CharityCampaign"));
const CharityOrganization_1 = __importDefault(require("../models/CharityOrganization"));
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId, charityOrgId, content, rating } = req.body;
    const user = req.user;
    try {
        // Kiểm tra xếp hạng hợp lệ
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        // Kiểm tra ít nhất có campaignId hoặc charityOrgId
        if (!campaignId && !charityOrgId) {
            return res.status(400).json({ message: 'Must provide campaignId or charityOrgId' });
        }
        // Kiểm tra campaignId hợp lệ
        if (campaignId) {
            const campaign = yield CharityCampaign_1.default.findByPk(campaignId);
            if (!campaign) {
                return res.status(404).json({ message: 'Campaign not found' });
            }
        }
        // Kiểm tra charityOrgId hợp lệ
        if (charityOrgId) {
            const charityOrg = yield CharityOrganization_1.default.findByPk(charityOrgId);
            if (!charityOrg) {
                return res.status(404).json({ message: 'Charity organization not found' });
            }
        }
        // Tạo phản hồi
        const feedback = yield Feedback_1.default.create({
            userId: user.id,
            campaignId: campaignId || null,
            charityOrgId: charityOrgId || null,
            content,
            rating,
        });
        res.status(201).json({ message: 'Feedback created', feedback });
    }
    catch (err) {
        console.error('Create feedback error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createFeedback = createFeedback;
const getFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId, charityOrgId } = req.query;
    try {
        const whereClause = {};
        if (campaignId) {
            whereClause.campaignId = campaignId;
        }
        if (charityOrgId) {
            whereClause.charityOrgId = charityOrgId;
        }
        const feedbacks = yield Feedback_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: User_1.default,
                    attributes: ['id', 'name', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(feedbacks);
    }
    catch (err) {
        console.error('Get feedbacks error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getFeedbacks = getFeedbacks;
