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
exports.verifyCharityOrg = void 0;
const CharityOrganization_1 = __importDefault(require("../models/CharityOrganization"));
const User_1 = __importDefault(require("../models/User"));
const verifyCharityOrg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const charityOrg = yield CharityOrganization_1.default.findByPk(organizationID);
        if (!charityOrg) {
            res.status(404).json({ message: 'Charity organization not found' });
            return;
        }
        // Cập nhật isApproved thành true
        charityOrg.isApproved = true;
        yield charityOrg.save();
        // Cập nhật additionalApproval trong bảng users thành 'APPROVED'
        const userToUpdate = yield User_1.default.findByPk(charityOrg.userId);
        if (!userToUpdate) {
            res.status(404).json({ message: 'User associated with the charity organization not found' });
            return;
        }
        userToUpdate.additionalApproval = 'APPROVED';
        yield userToUpdate.save();
        res.status(200).json({ message: 'Charity organization verified successfully' });
    }
    catch (error) {
        console.error('Error verifying charity organization:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyCharityOrg = verifyCharityOrg;
