import { Request, Response } from 'express';
import CharityCampaign from '../models/CharityCampaign';
import Donation from '../models/Donation';

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await CharityCampaign.findAll();
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

export const getCampaignById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const campaign = await CharityCampaign.findByPk(id);
    if (!campaign) return res.status(404).json({ message: 'Chiến dịch không tồn tại' });

    // Tính toán tổng số tiền đã đóng góp
    const totalDonations = await Donation.sum('amount', {
      where: { campaignId: id, status: 'completed' },
    });
    campaign.currentAmount = totalDonations || 0;

    res.status(200).json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};
