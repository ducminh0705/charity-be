import { Request, Response } from 'express';
import Donation from '../models/Donation';
import { Op } from 'sequelize';

export const getDonationsReport = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;
  try {
    const whereClause: any = { status: 'completed' };

    if (startDate && endDate) {
      whereClause.createdAt = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)],
      };
    }

    const donations = await Donation.findAll({ where: whereClause });

    res.status(200).json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};
