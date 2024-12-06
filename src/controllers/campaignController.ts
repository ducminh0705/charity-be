import { Request, Response } from 'express';
import CharityCampaign from '../models/CharityCampaign';
import CharityOrganization from '../models/CharityOrganization';
import Location from '../models/Location';
import { AuthRequest } from '../middlewares/auth';
import User from '../models/User';
import Donation from '../models/Donation';

export const createCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Không được ủy quyền' });
    return;
  }

  // Chỉ cho phép charity_org và admin tạo campaign
  if (user.role !== 'charity_org' && user.role !== 'admin') {
    res.status(403).json({ message: 'Không được phép' });
    return;
  }

  const { title, description, goalAmount, startDate, endDate, locations, url } = req.body;
 
  try {
    let charityOrgId = null;

    if (user.role === 'charity_org') {
      const charityOrg = await CharityOrganization.findOne({ where: { userPhone: user.phoneNumber } });
      if (!charityOrg) {
        res.status(400).json({ message: 'Người dùng không liên kết với bất kỳ tổ chức từ thiện nào' });
        return;
      }
      charityOrgId = charityOrg.id;
    } else if (user.role === 'admin') {
      // Trong trường hợp admin, cần nhận charityOrgId từ request
      charityOrgId = req.body.charityOrgId;
      if (!charityOrgId) {
        res.status(400).json({ message: 'charityOrgId là bắt buộc đối với quản trị viên' });
        return;
      }
    }

    // Tạo chiến dịch mới
    const campaign = await CharityCampaign.create({
      charityOrgId,
      title,
      description,
      goalAmount,
      startDate,
      endDate,
      status: 'pending',
      url,
    });

    // Nếu có danh sách locations, tạo các location
    if (locations && Array.isArray(locations)) {
      for (const loc of locations) {
        await Location.create({
          campaignId: campaign.id,
          name: loc.name,
          latitude: loc.latitude,
          longitude: loc.longitude,
          damageLevel: loc.damageLevel,
          needsHelp: loc.needsHelp,
          ward: loc.ward,
          district: loc.district,
          province: loc.province,
          city: loc.city,
          goalAmount: loc.goalAmount,
        });
      }
    }

    res.status(201).json({ message: 'Chiến dịch được tạo thành công', campaign });
  } catch (error) {
    console.error('Xảy ra lỗi khi tạo chiến dịch:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    res.status(401).json({ message: 'Không được ủy quyền' });
    return;
  }

  // Chỉ cho phép charity_org và admin cập nhật campaign
  if (user.role !== 'charity_org' && user.role !== 'admin') {
    res.status(403).json({ message: 'Không được phép' });
    return;
  }

  try {
    const campaign = await CharityCampaign.findByPk(id, {
      include: [Location],
    });

    if (!campaign) {
      res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
      return;
    }

    if (user.role === 'charity_org') {
      const charityOrg = await CharityOrganization.findOne({ where: { userPhone: user.phoneNumber  } });
      if (!charityOrg || charityOrg.id !== campaign.charityOrgId) {
        res.status(403).json({ message: 'Bạn không có quyền cập nhật chiến dịch này' });
        return;
      }
    }

    // Cập nhật campaign
    const { title, description, goalAmount, startDate, endDate, status, locations, url } = req.body;

    campaign.title = title || campaign.title;
    campaign.description = description || campaign.description;
    campaign.goalAmount = goalAmount || campaign.goalAmount;
    campaign.startDate = startDate || campaign.startDate;
    campaign.endDate = endDate || campaign.endDate;
    campaign.url = url || campaign.url;

    // Chỉ admin mới có thể cập nhật status
    if (user.role === 'admin' && status) {
      campaign.status = status;
    }

    await campaign.save();

    if (locations && Array.isArray(locations)) {
      const existingLocations = await Location.findAll({ where: { campaignId: campaign.id } });
      const existingLocationIds = existingLocations.map(loc => loc.id);
      const incomingLocationIds = locations.map(loc => loc.id).filter(id => id !== undefined);

      // Update or create locations
      for (const loc of locations) {
      if (loc.id) {
        const location = await Location.findOne({ where: { campaignId: campaign.id, id: loc.id } });
        if (location) {
        location.name = loc.name || location.name;
        location.latitude = loc.latitude || location.latitude;
        location.longitude = loc.longitude || location.longitude;
        location.damageLevel = loc.damageLevel || location.damageLevel;
        location.needsHelp = loc.needsHelp || location.needsHelp;
        location.ward = loc.ward || location.ward;
        location.district = loc.district || location.district;
        location.province = loc.province || location.province;
        location.city = loc.city || location.city;
        location.goalAmount = loc.goalAmount || location.goalAmount;
        await location.save();
        }
      } else {
        await Location.create({
        campaignId: campaign.id,
        name: loc.name,
        latitude: loc.latitude,
        longitude: loc.longitude,
        damageLevel: loc.damageLevel,
        needsHelp: loc.needsHelp,
        ward: loc.ward,
        district: loc.district,
        province: loc.province,
        city: loc.city,
        goalAmount: loc.goalAmount,
        });
      }
      }

      // Delete locations that are not in the incoming list
      for (const existingLocationId of existingLocationIds) {
      if (!incomingLocationIds.includes(existingLocationId)) {
        await Location.destroy({ where: { id: existingLocationId } });
      }
      }
    }

    res.status(200).json({ message: 'Cập nhật chiến dịch thành công', campaign });
  } catch (error) {
    console.error('Xảy ra lỗi khi cập nhật chiến dịch:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  const { status, charityOrgId } = req.query;

  try {
    const whereClause: any = {};

    if (status) {
      whereClause.status = status;
    }

    if (charityOrgId) {
      whereClause.charityOrgId = charityOrgId;
    }

    const campaigns = await CharityCampaign.findAll({
      where: whereClause,
      include: [
        {
          model: Location,
        },
        {
          model: CharityOrganization,
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(campaigns);
  } catch (error) {
    console.error('Lỗi trả thông tin:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const campaign = await CharityCampaign.findByPk(id, {
      include: [
        {
          model: Location,
        },
        {
          model: CharityOrganization,
          include: [
            {
              model: User,
              attributes: ['id', 'firstName', 'lastName', 'email'],
            },
          ],
        },
      ],
    });

    if (!campaign) {
      res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
      return;
    }

    res.status(200).json(campaign);
  } catch (error) {
    console.error('Lỗi trả kết quả:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const deleteCampaign = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    res.status(401).json({ message: 'Không được uỷ quyền' });
    return;
  }

  // Chỉ cho phép charity_org và admin xóa campaign
  if (user.role !== 'charity_org' && user.role !== 'admin') {
    res.status(403).json({ message: 'Không được phép' });
    return;
  }

  try {
    const campaign = await CharityCampaign.findByPk(id);

    if (!campaign) {
      res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
      return;
    }

    if (user.role === 'charity_org') {
      const charityOrg = await CharityOrganization.findOne({ where: { userPhone: user.phoneNumber  } });
      if (!charityOrg || charityOrg.id !== campaign.charityOrgId) {
        res.status(403).json({ message: 'Bạn không có quyền xóa chiến dịch này' });
        return;
      }
    }

    await campaign.destroy();

    res.status(200).json({ message: 'Chiến dịch đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xoá chiến dịch:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateCampaignStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;
  const { id } = req.params;
  const { status } = req.body;

  if (!user) {
    res.status(401).json({ message: 'Không được ủy quyền' });
    return;
  }

  // Chỉ admin mới có thể cập nhật trạng thái chiến dịch
  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Không được phép' });
    return;
  }

  if (!['pending', 'active', 'completed', 'cancelled'].includes(status)) {
    res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    return;
  }

  try {
    const campaign = await CharityCampaign.findByPk(id);

    if (!campaign) {
      res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
      return;
    }

    if (campaign.status !== status) {
      campaign.status = status;
      await campaign.save();

      // Gửi thông báo cho người đóng góp về sự thay đổi trạng thái
      // Lấy danh sách người đóng góp
      // const donations = await Donation.findAll({
      //   where: { campaignId: campaign.id, status: 'completed' },
      //   include: [{ model: User }],
      // });

      // Duyệt qua danh sách người đóng góp và gửi thông báo
      // for (const donation of donations) {
      //   const donor = donation.User; // Join với bảng User thông qua userId
      //   if (donor && donor.email) {
      //     // Gửi email hoặc thông báo khác
      //     // Ví dụ: sendEmail(donor.email, 'Campaign Status Update', `The campaign "${campaign.title}" has changed its status to "${status}".`);
      //   }
      // }
    }

    res.status(200).json({ message: 'Trạng thái của chiến dịch đã được cập nhật thành công', campaign });
  } catch (error) {
    console.error('Xảy ra lỗi khi cập nhật trạng thái chiến dịch:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
