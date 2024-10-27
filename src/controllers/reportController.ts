import { Request, Response } from 'express';
import { Op } from 'sequelize';
import Donation from '../models/Donation';
import Expense from '../models/Expense';
import CharityCampaign from '../models/CharityCampaign';
import CharityOrganization from '../models/CharityOrganization';
import User from '../models/User';


export const getDonationsReport = async (req: Request, res: Response): Promise<void> => {
  const { campaign_id, charity_org_id } = req.query;

  try {
    const whereClause: any = {};

    if (campaign_id) {
      whereClause.campaignId = campaign_id;
    }

    // Lấy danh sách campaignId từ charity_org_id
    if (charity_org_id) {
      const campaigns = await CharityCampaign.findAll({
        where: { charityOrgId: charity_org_id },
        attributes: ['id'],
      });

      const campaignIds = campaigns.map((campaign) => campaign.id);

      if (campaignIds.length === 0) {
        res.status(200).json([]);
        return;
      }

      whereClause.campaignId = {
        [Op.in]: campaignIds,
      };
    }

    const donations = await Donation.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
        },
        {
          model: CharityCampaign,
          as: 'CharityCampaign',
          attributes: ['id', 'title'],
          include: [
            {
              model: CharityOrganization,
              as: 'charityOrganization',
              attributes: ['id', 'organizationName'],
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getExpensesReport = async (req: Request, res: Response): Promise<void> => {
  const { campaign_id, charity_org_id } = req.query;

  try {
    const whereClause: any = {};

    if (campaign_id) {
      whereClause.campaignId = campaign_id;
    }

    if (charity_org_id) {
      // Lấy danh sách campaignId từ charity_org_id
      const campaigns = await CharityCampaign.findAll({
        where: { charityOrgId: charity_org_id },
        attributes: ['id'],
      });

      const campaignIds = campaigns.map((campaign) => campaign.id);

      if (campaignIds.length === 0) {
        res.status(200).json([]);
        return;
      }

      whereClause.campaignId = {
        [Op.in]: campaignIds,
      };
    }

    const expenses = await Expense.findAll({
      where: whereClause,
      include: [
        {
          model: CharityCampaign,
          as: 'CharityCampaign',
          attributes: ['id', 'title'],
          include: [
            {
              model: CharityOrganization,
              as: 'charityOrganization',
              attributes: ['id', 'organizationName'],
              include: [
                {
                  model: User,
                  attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'],
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

