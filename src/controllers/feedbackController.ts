import { Request, Response } from 'express';
import Feedback from '../models/Feedback';
import User from '../models/User';
import CharityCampaign from '../models/CharityCampaign';
import CharityOrganization from '../models/CharityOrganization';

// export const createFeedback = async (req: Request, res: Response) => {
//   const { campaignId, charityOrgId, content, rating } = req.body;
//   const user = (req as any).user as User;

//   try {
//     // Kiểm tra xếp hạng hợp lệ
//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//     }

//     // Kiểm tra ít nhất có campaignId hoặc charityOrgId
//     if (!campaignId && !charityOrgId) {
//       return res.status(400).json({ message: 'Must provide campaignId or charityOrgId' });
//     }

//     // Kiểm tra campaignId hợp lệ
//     if (campaignId) {
//       const campaign = await CharityCampaign.findByPk(campaignId);
//       if (!campaign) {
//         return res.status(404).json({ message: 'Campaign not found' });
//       }
//     }

//     // Kiểm tra charityOrgId hợp lệ
//     if (charityOrgId) {
//       const charityOrg = await CharityOrganization.findByPk(charityOrgId);
//       if (!charityOrg) {
//         return res.status(404).json({ message: 'Charity organization not found' });
//       }
//     }

//     // Tạo phản hồi
//     const feedback = await Feedback.create({
//       userId: user.id,
//       campaignId: campaignId || null,
//       charityOrgId: charityOrgId || null,
//       content,
//       rating,
//     });

//     res.status(201).json({ message: 'Feedback created', feedback });
//   } catch (err) {
//     console.error('Create feedback error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  const { campaignId, content, rating } = req.body;
  const user = (req as any).user as User;

  try {
    // Validate rating
    if (rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    // Ensure either campaignId or charityOrgId is provided
    if (!campaignId ) {
      res.status(400).json({ message: 'Must provide campaignId' });
      return;
    }

    // Validate campaignId
    if (campaignId) {
      const campaign = await CharityCampaign.findByPk(campaignId);
      if (!campaign) {
        res.status(404).json({ message: 'Campaign not found' });
        return;
      }
    }
    // Create feedback
    const feedback = await Feedback.create({
      userId: user.id,
      campaignId: campaignId || null,
      charityOrgId: null,
      content,
      rating,
    });

    res.status(201).json({ message: 'Feedback created', feedback });
  } catch (err) {
    console.error('Create feedback error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const getFeedbacks = async (req: Request, res: Response) => {
    const { campaignId, charityOrgId } = req.query;
  
    try {
      const whereClause: any = {};
  
      if (campaignId) {
        whereClause.campaignId = campaignId;
      }
  
      if (charityOrgId) {
        whereClause.charityOrgId = charityOrgId;
      }
  
      const feedbacks = await Feedback.findAll({
        where: whereClause,
        // include: [
        //   {
        //     model: User,
        //     attributes: ['id', 'name', 'email'],
        //   },
        // ],
        order: [['createdAt', 'DESC']],
      });
  
      res.status(200).json(feedbacks);
    } catch (err) {
      console.error('Get feedbacks error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  