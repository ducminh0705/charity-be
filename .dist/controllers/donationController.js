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
exports.updateDonationStatus = exports.getDonations = exports.createDonation = void 0;
const Donation_1 = __importDefault(require("../models/Donation"));
const CharityCampaign_1 = __importDefault(require("../models/CharityCampaign"));
const createDonation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { campaignId, locationId, amount, method } = req.body;
    const user = req.user;
    try {
        const campaign = yield CharityCampaign_1.default.findByPk(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Chiến dịch không tồn tại' });
            return;
        }
        yield Donation_1.default.create({
            donorId: user.id,
            campaignId,
            locationId,
            amount,
            method,
            transactionId: null,
            status: 'pending',
        });
        campaign.currentAmount = campaign.currentAmount + amount;
        yield campaign.save();
        res.status(201).json({ message: 'Đóng góp thành công' });
    }
    catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
        return;
    }
});
exports.createDonation = createDonation;
const getDonations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { status } = req.query;
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        return;
    }
    if (status && !['pending', 'completed', 'failed'].includes(status)) {
        res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        return;
    }
    try {
        const whereClause = status ? { status } : {};
        const donations = yield Donation_1.default.findAll({ where: whereClause });
        res.status(200).json(donations);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
exports.getDonations = getDonations;
const updateDonationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { donationId, status } = req.body;
    if (user.role !== 'admin') {
        res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        return;
    }
    if (!['completed', 'failed'].includes(status)) {
        res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        return;
    }
    try {
        const donation = yield Donation_1.default.findByPk(donationId);
        if (!donation) {
            res.status(404).json({ message: 'Donation không tồn tại' });
            return;
        }
        donation.status = status;
        yield donation.save();
        res.status(200).json({ message: 'Cập nhật trạng thái thành công', donation });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
exports.updateDonationStatus = updateDonationStatus;
