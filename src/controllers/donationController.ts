import { Request, Response } from 'express';
import Donation from '../models/Donation';
import User from '../models/User';
import CharityCampaign from '../models/CharityCampaign';

export const createDonation = async (req: Request, res: Response): Promise<void> => {
  const { campaignId, locationId, amount, method } = req.body;
  const user = (req as any).user as User;

  try {
    const campaign = await CharityCampaign.findByPk(campaignId);
    if (!campaign) {
      res.status(404).json({ message: 'Chiến dịch không tồn tại' });
      return;
    }

    await Donation.create({
      donorId: user.id,
      campaignId,
      locationId,
      amount,
      method,
      transactionId: null,
      status: 'pending',
    });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
    return;
  }
};

export const getPendingDonation = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user as User;

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Bạn không có quyền truy cập' });
    return
  }

  try {
    const pendingDonations = await Donation.findAll({ where: { status: 'pending' } });
    res.status(200).json(pendingDonations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

export const updateDonationStatus = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user as User;
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
    const donation = await Donation.findByPk(donationId);
    if (!donation) {
      res.status(404).json({ message: 'Donation không tồn tại' });
      return;
    }

    donation.status = status;
    await donation.save();

    res.status(200).json({ message: 'Cập nhật trạng thái thành công', donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};


