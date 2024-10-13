import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import CharityOrganization from '../models/CharityOrganization';
import User from '../models/User';

export const verifyCharityOrg = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user;

  // Kiểm tra xem người dùng đã đăng nhập và có vai trò admin hay không
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  if (user.role !== 'admin') {
    res.status(403).json({ message: 'Forbidden: Only admin can verify charity organizations' });
    return;
  }

  const { organizationID } = req.params;

  if (!organizationID) {
    res.status(400).json({ message: 'Missing organizationID' });
    return;
  }

  try {
    // Tìm tổ chức từ thiện theo organizationID
    const charityOrg = await CharityOrganization.findByPk(organizationID);

    if (!charityOrg) {
      res.status(404).json({ message: 'Charity organization not found' });
      return;
    }

    // Cập nhật isApproved thành true
    charityOrg.isApproved = true;
    await charityOrg.save();

    // Cập nhật additionalApproval trong bảng users thành 'APPROVED'
    const userToUpdate = await User.findByPk(charityOrg.userId);

    if (!userToUpdate) {
      res.status(404).json({ message: 'User associated with the charity organization not found' });
      return;
    }

    userToUpdate.additionalApproval = 'APPROVED';
    await userToUpdate.save();

    res.status(200).json({ message: 'Charity organization verified successfully' });
  } catch (error) {
    console.error('Error verifying charity organization:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
