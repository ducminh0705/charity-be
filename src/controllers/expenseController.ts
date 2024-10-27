import { Request, Response } from 'express';
import Expense from '../models/Expense';
import CharityCampaign from '../models/CharityCampaign';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';

export const createExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  const { campaignId, amount, description } = req.body;
  const user = req.user as User;

  // Chỉ cho phép charity_org và admin tạo expense
  if (!user || (user.role !== 'charity_org' && user.role !== 'admin')) {
    res.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' });
    return;
  }

  try {
    const campaign = await CharityCampaign.findByPk(campaignId);
    if (!campaign) {
      res.status(404).json({ message: 'Chiến dịch không tồn tại' });
      return;
    }

    // Kiểm tra số dư có đủ để chi tiêu không
    const totalDonations = campaign.currentAmount ?? 0;
    const totalExpenses = campaign.distributedAmount ?? 0;
    const remainingBalance = totalDonations - totalExpenses;

    if (amount > remainingBalance) {
      res.status(400).json({ message: 'Số dư không đủ để chi tiêu số tiền này' });
      return;
    }

    const expense = await Expense.create({
      campaignId,
      amount,
      description,
    });

    // Cập nhật distributedAmount trong CharityCampaign
    campaign.distributedAmount = campaign.distributedAmount + amount;
    await campaign.save();

    res.status(201).json({ message: 'Ghi nhận chi tiêu thành công', expense });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};
