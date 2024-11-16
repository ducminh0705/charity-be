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
exports.createExpense = void 0;
const Expense_1 = __importDefault(require("../models/Expense"));
const CharityCampaign_1 = __importDefault(require("../models/CharityCampaign"));
const createExpense = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { campaignId, amount, description } = req.body;
    const user = req.user;
    // Chỉ cho phép charity_org và admin tạo expense
    if (!user || (user.role !== 'charity_org' && user.role !== 'admin')) {
        res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
        return;
    }
    try {
        const campaign = yield CharityCampaign_1.default.findByPk(campaignId);
        if (!campaign) {
            res.status(404).json({ message: 'Chiến dịch không tồn tại' });
            return;
        }
        // Kiểm tra số dư có đủ để chi tiêu không
        const totalDonations = (_a = campaign.currentAmount) !== null && _a !== void 0 ? _a : 0;
        const totalExpenses = (_b = campaign.distributedAmount) !== null && _b !== void 0 ? _b : 0;
        const remainingBalance = totalDonations - totalExpenses;
        if (amount > remainingBalance) {
            res.status(400).json({ message: 'Số dư không đủ để chi tiêu số tiền này' });
            return;
        }
        const expense = yield Expense_1.default.create({
            campaignId,
            amount,
            description,
        });
        // Cập nhật distributedAmount trong CharityCampaign
        campaign.distributedAmount = campaign.distributedAmount + amount;
        yield campaign.save();
        res.status(201).json({ message: 'Ghi nhận chi tiêu thành công', expense });
    }
    catch (err) {
        console.error('Error creating expense:', err);
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
exports.createExpense = createExpense;
