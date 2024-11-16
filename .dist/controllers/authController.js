"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.refreshToken = exports.loginUser = exports.verifyOTP = exports.registerCharityOrg = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const OTPVerification_1 = __importDefault(require("../models/OTPVerification"));
const User_1 = __importDefault(require("../models/User"));
const CharityOrganization_1 = __importDefault(require("../models/CharityOrganization"));
const sequelize_1 = require("sequelize");
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password, firstName, lastName, email, role } = req.body;
    try {
        const existingUser = yield User_1.default.findOne({ where: { phoneNumber } });
        if (existingUser) {
            res.status(400).json({ message: 'Số điện thoại đã được đăng ký' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const additionalApproval = role === 'charity_org' ? 'PENDING' : 'NOT_NEEDED';
        const user = yield User_1.default.create({
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
    }
    catch (err) {
        // res.status(500).json({ message: 'Đã xảy ra lỗi' });
        next(err);
    }
});
exports.registerUser = registerUser;
const registerCharityOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password, firstName, lastName, email, organizationName, licenseDocument, birthDate, } = req.body;
    if (!phoneNumber ||
        !password ||
        !firstName ||
        !lastName ||
        !email ||
        !organizationName ||
        !licenseDocument ||
        !birthDate) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }
    try {
        const existingUser = yield User_1.default.findOne({
            where: {
                [sequelize_1.Op.or]: [{ phoneNumber }, { email }],
            },
        });
        if (existingUser) {
            res.status(409).json({ message: 'Phone number or email already in use' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield User_1.default.create({
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
        const charityOrg = yield CharityOrganization_1.default.create({
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
    }
    catch (error) {
        console.error('Error registering charity organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.registerCharityOrg = registerCharityOrg;
const verifyOTP = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, otpCode } = req.body;
    try {
        const user = yield User_1.default.findOne({ where: { phoneNumber } });
        if (!user) {
            res.status(400).json({ message: 'Người dùng không tồn tại' });
            return;
        }
        const otpRecord = yield OTPVerification_1.default.findOne({
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
        yield user.save();
        // Xóa OTP sau khi sử dụng
        yield OTPVerification_1.default.destroy({ where: { userId: user.id } });
        res.status(200).json({ message: 'Xác minh thành công' });
    }
    catch (err) {
        res.status(500).json({ message: 'Đã xảy ra lỗi' });
    }
});
exports.verifyOTP = verifyOTP;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ where: { phoneNumber } });
        if (!user) {
            res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
            return;
        }
        if (user.role === 'charity_org') {
            if (!user.isVerified || user.additionalApproval !== 'APPROVED') {
                res.status(400).json({ message: 'Tài khoản chưa được xác thực hoặc giấy phép kinh doanh chưa được duyệt' });
                return;
            }
        }
        else {
            if (!user.isVerified) {
                res.status(400).json({ message: 'Tài khoản chưa được xác minh' });
                return;
            }
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 15}m` });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE_DAYS || 7}d` });
        // Lưu refreshToken vào cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });
        res.status(200).json({ accessToken, tokenType: 'Bearer' });
    }
    catch (err) {
        // res.status(500).json({ message: 'Đã xảy ra lỗi' });
        next(err);
    }
});
exports.loginUser = loginUser;
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET || 'your_secret_key');
        const user = yield User_1.default.findByPk(payload.userId);
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES || 15}m` });
        res.status(200).json({ accessToken: newAccessToken, tokenType: 'Bearer' });
    }
    catch (err) {
        res.sendStatus(401);
    }
});
exports.refreshToken = refreshToken;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.status(200).json({
        id: user.id,
        phoneNumber: user.phoneNumber,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });
});
exports.getCurrentUser = getCurrentUser;
