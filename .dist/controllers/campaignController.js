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
exports.updateCampaignStatus = exports.deleteCampaign = exports.getCampaignById = exports.getCampaigns = exports.updateCampaign = exports.createCampaign = void 0;
const CharityCampaign_1 = __importDefault(require("../models/CharityCampaign"));
const CharityOrganization_1 = __importDefault(require("../models/CharityOrganization"));
const Location_1 = __importDefault(require("../models/Location"));
const User_1 = __importDefault(require("../models/User"));
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const { title, description, goalAmount, startDate, endDate, locations } = req.body;
    try {
        let charityOrgId = null;
        if (user.role === 'charity_org') {
            const charityOrg = yield CharityOrganization_1.default.findOne({ where: { userId: user.id } });
            if (!charityOrg) {
                res.status(400).json({ message: 'Người dùng không liên kết với bất kỳ tổ chức từ thiện nào' });
                return;
            }
            charityOrgId = charityOrg.id;
        }
        else if (user.role === 'admin') {
            // Trong trường hợp admin, cần nhận charityOrgId từ request
            charityOrgId = req.body.charityOrgId;
            if (!charityOrgId) {
                res.status(400).json({ message: 'charityOrgId là bắt buộc đối với quản trị viên' });
                return;
            }
        }
        // Tạo chiến dịch mới
        const campaign = yield CharityCampaign_1.default.create({
            charityOrgId,
            title,
            description,
            goalAmount,
            startDate,
            endDate,
            status: 'pending',
        });
        // Nếu có danh sách locations, tạo các location
        if (locations && Array.isArray(locations)) {
            for (const loc of locations) {
                yield Location_1.default.create({
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
    }
    catch (error) {
        console.error('Xảy ra lỗi khi tạo chiến dịch:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.createCampaign = createCampaign;
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const campaign = yield CharityCampaign_1.default.findByPk(id, {
            include: [Location_1.default],
        });
        if (!campaign) {
            res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
            return;
        }
        if (user.role === 'charity_org') {
            const charityOrg = yield CharityOrganization_1.default.findOne({ where: { userId: user.id } });
            if (!charityOrg || charityOrg.id !== campaign.charityOrgId) {
                res.status(403).json({ message: 'Bạn không có quyền cập nhật chiến dịch này' });
                return;
            }
        }
        // Cập nhật campaign
        const { title, description, goalAmount, startDate, endDate, status, locations } = req.body;
        campaign.title = title || campaign.title;
        campaign.description = description || campaign.description;
        campaign.goalAmount = goalAmount || campaign.goalAmount;
        campaign.startDate = startDate || campaign.startDate;
        campaign.endDate = endDate || campaign.endDate;
        // Chỉ admin mới có thể cập nhật status
        if (user.role === 'admin' && status) {
            campaign.status = status;
        }
        yield campaign.save();
        if (locations && Array.isArray(locations)) {
            const existingLocations = yield Location_1.default.findAll({ where: { campaignId: campaign.id } });
            const existingLocationIds = existingLocations.map(loc => loc.id);
            const incomingLocationIds = locations.map(loc => loc.id).filter(id => id !== undefined);
            // Update or create locations
            for (const loc of locations) {
                if (loc.id) {
                    const location = yield Location_1.default.findOne({ where: { campaignId: campaign.id, id: loc.id } });
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
                        yield location.save();
                    }
                }
                else {
                    yield Location_1.default.create({
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
                    yield Location_1.default.destroy({ where: { id: existingLocationId } });
                }
            }
        }
        res.status(200).json({ message: 'Cập nhật chiến dịch thành công', campaign });
    }
    catch (error) {
        console.error('Xảy ra lỗi khi cập nhật chiến dịch:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.updateCampaign = updateCampaign;
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, charityOrgId } = req.query;
    try {
        const whereClause = {};
        if (status) {
            whereClause.status = status;
        }
        if (charityOrgId) {
            whereClause.charityOrgId = charityOrgId;
        }
        const campaigns = yield CharityCampaign_1.default.findAll({
            where: whereClause,
            include: [
                {
                    model: Location_1.default,
                },
                {
                    model: CharityOrganization_1.default,
                    include: [
                        {
                            model: User_1.default,
                            attributes: ['id', 'firstName', 'lastName', 'email'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(campaigns);
    }
    catch (error) {
        console.error('Lỗi trả thông tin:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.getCampaigns = getCampaigns;
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const campaign = yield CharityCampaign_1.default.findByPk(id, {
            include: [
                {
                    model: Location_1.default,
                },
                {
                    model: CharityOrganization_1.default,
                    include: [
                        {
                            model: User_1.default,
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
    }
    catch (error) {
        console.error('Lỗi trả kết quả:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.getCampaignById = getCampaignById;
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const campaign = yield CharityCampaign_1.default.findByPk(id);
        if (!campaign) {
            res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
            return;
        }
        if (user.role === 'charity_org') {
            const charityOrg = yield CharityOrganization_1.default.findOne({ where: { userId: user.id } });
            if (!charityOrg || charityOrg.id !== campaign.charityOrgId) {
                res.status(403).json({ message: 'Bạn không có quyền xóa chiến dịch này' });
                return;
            }
        }
        yield campaign.destroy();
        res.status(200).json({ message: 'Chiến dịch đã được xóa thành công' });
    }
    catch (error) {
        console.error('Lỗi khi xoá chiến dịch:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.deleteCampaign = deleteCampaign;
const updateCampaignStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const campaign = yield CharityCampaign_1.default.findByPk(id);
        if (!campaign) {
            res.status(404).json({ message: 'Không tìm thấy chiến dịch' });
            return;
        }
        if (campaign.status !== status) {
            campaign.status = status;
            yield campaign.save();
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
    }
    catch (error) {
        console.error('Xảy ra lỗi khi cập nhật trạng thái chiến dịch:', error);
        res.status(500).json({ message: 'Lỗi máy chủ' });
    }
});
exports.updateCampaignStatus = updateCampaignStatus;
