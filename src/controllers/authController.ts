import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OTPVerification from '../models/OTPVerification';
import User from '../models/User';
import { sendOTP } from '../utils/sms';
import CharityOrganization from '../models/CharityOrganization';
import { Sequelize, Op } from 'sequelize';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber, password, firstName, lastName, email, role } = req.body;
  try {
    const existingUser = await User.findOne({ where: { phoneNumber } });
    if (existingUser) {
      res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const additionalApproval = role === 'charity_org' ? 'PENDING' : 'NOT_NEEDED';

    const user = await User.create({
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role,
      additionalApproval,
    });

    // Tạo mã OTP
    // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    // const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

    // await OTPVerification.create({ userId: user.id, otpCode, expiresAt });

    // Gửi SMS
    // await sendOTP(res, phoneNumber);

    res.status(200).json({ message: 'Đã gửi mã xác minh đến số điện thoại của bạn' });
  } catch (err) {
    // res.status(500).json({ message: 'Đã xảy ra lỗi' });
    next(err);
  }
};

export const registerCharityOrg = async (req: Request, res: Response): Promise<void> => {
  const {
    phoneNumber,
    password,
    firstName,
    lastName,
    email,
    organizationName,
    licenseDocument,
    birthDate,
  } = req.body;

  if (
    !phoneNumber ||
    !password ||
    !firstName ||
    !lastName ||
    !email ||
    !organizationName ||
    !licenseDocument ||
    !birthDate
  ) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ phoneNumber }, { email }],
      },
    });

    if (existingUser) {
      res.status(409).json({ message: 'Phone number or email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      email,
      role: 'charity_org',
      isVerified: false,
      birthDate,
      additionalApproval: 'PENDING',
    });

    const charityOrg = await CharityOrganization.create({
      userId: user.id,
      organizationName,
      licenseDocument,
      isApproved: false,
    });

    res.status(201).json({
      message: 'Charity organization registered successfully',
      userId: user.id,
      charityOrgId: charityOrg.id,
    });
  } catch (error) {
    console.error('Error registering charity organization:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { phoneNumber, otpCode } = req.body;
  try {
    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      res.status(400).json({ message: 'Người dùng không tồn tại' });
      return;
    }

    const otpRecord = await OTPVerification.findOne({
      where: { userId: user.id, otpCode },
    });

    if (!otpRecord) {
      res.status(400).json({ message: 'Mã OTP không hợp lệ' });
      return;
    }
    if (otpRecord.expiresAt < new Date()) {
      res.status(400).json({ message: 'Mã OTP đã hết hạn' });
      return;
    }

    user.isVerified = true;
    await user.save();

    // Xóa OTP sau khi sử dụng
    await OTPVerification.destroy({ where: { userId: user.id } });

    res.status(200).json({ message: 'Xác minh thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
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
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 15}m` }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_DAYS || 7}d` }
    );

    // Lưu refreshToken vào cookie HTTP-only
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    res.status(200).json({ accessToken, tokenType: 'Bearer' });
  } catch (err) {
    // res.status(500).json({ message: 'Đã xảy ra lỗi' });
    next(err);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.sendStatus(401);
    return;
  }

  try {
    const payload: any = jwt.verify(refreshToken, process.env.JWT_SECRET || 'your_secret_key');
    const user = await User.findByPk(payload.userId);
    if (!user) {
      res.sendStatus(401);
      return;
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 15}m` }
    );

    res.status(200).json({ accessToken: newAccessToken, tokenType: 'Bearer' });
  } catch (err) {
    res.sendStatus(401);
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



