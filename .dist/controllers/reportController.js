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
exports.getExpensesReport = exports.getDonationsReport = void 0;
const sequelize_1 = require("sequelize");
const Donation_1 = __importDefault(require("../models/Donation"));
const Expense_1 = __importDefault(require("../models/Expense"));
const CharityCampaign_1 = __importDefault(require("../models/CharityCampaign"));
const CharityOrganization_1 = __importDefault(require("../models/CharityOrganization"));
const User_1 = __importDefault(require("../models/User"));
const getDonationsReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaign_id, charity_org_id } = req.query;
    try {
        const whereClause = {};
        if (campaign_id) {
            whereClause.campaignId = campaign_id;
        }
        // Lấy danh sách campaignId từ charity_org_id
        if (charity_org_id) {
            const campaigns = yield CharityCampaign_1.default.findAll({
                where: { charityOrgId: charity_org_id },
                attributes: ['id'],
            });
            const campaignIds = campaigns.map((campaign) => campaign.id);
            if (campaignIds.length === 0) {
                res.status(200).json([]);
                return;
            }
            whereClause.campaignId = {
                [sequelize_1.Op.in]: campaignIds,
            };
        }
        const donations = yield Donation_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: User_1.default,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                },
                {
                    model: CharityCampaign_1.default,
                    as: 'CharityCampaign',
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: CharityOrganization_1.default,
                            as: 'charityOrganization',
                            attributes: ['id', 'organizationName'],
                            include: [
                                {
                                    model: User_1.default,
                                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(donations);
    }
    catch (error) {
        console.error('Error fetching donations report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getDonationsReport = getDonationsReport;
const getExpensesReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaign_id, charity_org_id } = req.query;
    try {
        const whereClause = {};
        if (campaign_id) {
            whereClause.campaignId = campaign_id;
        }
        if (charity_org_id) {
            // Lấy danh sách campaignId từ charity_org_id
            const campaigns = yield CharityCampaign_1.default.findAll({
                where: { charityOrgId: charity_org_id },
                attributes: ['id'],
            });
            const campaignIds = campaigns.map((campaign) => campaign.id);
            if (campaignIds.length === 0) {
                res.status(200).json([]);
                return;
            }
            whereClause.campaignId = {
                [sequelize_1.Op.in]: campaignIds,
            };
        }
        const expenses = yield Expense_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: CharityCampaign_1.default,
                    as: 'CharityCampaign',
                    attributes: ['id', 'title'],
                    include: [
                        {
                            model: CharityOrganization_1.default,
                            as: 'charityOrganization',
                            attributes: ['id', 'organizationName'],
                            include: [
                                {
                                    model: User_1.default,
                                    attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(expenses);
    }
    catch (error) {
        console.error('Error fetching expenses report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getExpensesReport = getExpensesReport;
