import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OTPVerification from '../models/OTPVerification';
import User from '../models/User';
import { sendOTP } from '../utils/sms';
import CharityOrganization from '../models/CharityOrganization';
import { Sequelize, Op } from 'sequelize';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, phoneNumber, email, password, role, isVerified, birthDate } = req.body;
  
  if (!phoneNumber) {
    res.status(400).json({ message: 'Phone number is required' });
    return;
  }
  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    var additionalApproval;
    role === 'charity_org' ? additionalApproval= 'PENDING' : additionalApproval = 'NOT_NEEDED';

    const user = await User.create({
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role,
      additionalApproval,
      isVerified,
      birthDate
    });

    res.json({ 
      message: 'Tạo tài khoản thành công ',
      status: 200
     });
  } catch (err) {
    console.error(err);
    res.json({ 
      message: 'Tạo tài khoản không thành công ',
      status: 500
     });
  }
};

export const registerVerifiedUser = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, phoneNumber, email, password, role, isVerified, birthDate } = req.body;
  
  if (!phoneNumber) {
    res.status(400).json({ message: 'Phone number is required' });
    return;
  }
  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      // Update isVerified to true if the phone number exists
      await existingUser.update({ isVerified: true });
      res.json({ 
        message: 'User is already registered; verification status updated.',
        status: 200
      });
      return;
    }
  } catch (err) {
    console.error(err);
    res.json({ 
      message: 'Verified user registration không thành công ',
      status: 500
     });
  }
};

export const registerCharityOrg = async (req: Request, res: Response): Promise<void> => {
  const {
    phoneNumber,
    organizationName,
    licenseDocument
  } = req.body;

  if (
    !phoneNumber ||
    !organizationName ||
    !licenseDocument 
  ) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    // const existingUser = await User.findOne({
    //   where: {
    //     [Op.or]: [{ phoneNumber }, { email }],
    //   },
    // });

    // if (existingUser) {
    //   res.status(409).json({ message: 'Phone number or email already in use' });
    //   return;
    // }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // const user = await User.create({
    //   phoneNumber,
    //   password: hashedPassword,
    //   firstName,
    //   lastName,
    //   email,
    //   role: 'charity_org',
    //   isVerified: false,
    //   birthDate,
    //   additionalApproval: 'PENDING',
    // });

    const charityOrg = await CharityOrganization.create({
      userPhone: phoneNumber,
      organizationName,
      licenseDocument,
      isApproved: false,
    });

    res.status(201).json({
      message: 'Charity organization registered successfully',
      userPhone: phoneNumber,
      charityOrgId: charityOrg.id,
    });
  } catch (error) {
    console.error('Error registering charity organization:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber, password } = req.body;
  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
      return;
    }

    if (user.role === 'charity_org') {
      if (!user.isVerified || user.additionalApproval !== 'APPROVED') {
      res.status(400).json({ message: 'Tài khoản chưa được xác thực hoặc giấy phép kinh doanh chưa được duyệt' });
      return;
      }
    } else {
      if (!user.isVerified) {
      res.status(400).json({ message: 'Tài khoản chưa được xác minh' });
      return;
      }
    }

    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 7}d` }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_DAYS || 7}d` }
    );

    // Lưu refreshToken vào cookie HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/', // Ensure the cookie is accessible in all routes
    });

    res.status(200).json({ accessToken, tokenType: 'Bearer' });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: 'Unauthorized: No refresh token provided' });
    return;
  }

  try {
    const secretKey = process.env.JWT_SECRET || 'your_secret_key';

    // Verify the refresh token
    const payload: any = jwt.verify(refreshToken, secretKey);
    
    // Fetch the user
    const user = await User.findByPk(payload.userId);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    // Generate a new access token
    const accessToken = jwt.sign(
      { userId: user.id },
      secretKey,
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 15}m` }
    );

    res.status(200).json({ accessToken, tokenType: 'Bearer' });
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Unauthorized: Refresh token expired' });
    } else if (err.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Unauthorized: Invalid token' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  const user = (req as any).user as User;
  res.status(200).json({
    id: user.id,
    phoneNumber: user.phoneNumber,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });
};

export const getOrgNotApproval = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findAll({
      where: {
        [Op.or]: [{ additionalApproval: 'PENDING' }, {role:'charity_org'}],
      },
    });

    const existingOrg = await CharityOrganization.findAll({
      where: {
        [Op.or]: [{ isApproved: 0 }],
      },
    });

    if (existingUser && existingOrg) {
      res.status(201).json({
        message: 'getOrgNotApproval successfully',
        existingUser,
        existingOrg
      });
    }
    
  } catch (error) {
    console.error('Error getOrgNotApproval :', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



