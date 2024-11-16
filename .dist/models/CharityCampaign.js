"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const CharityOrganization_1 = __importDefault(require("./CharityOrganization"));
class CharityCampaign extends sequelize_1.Model {
}
CharityCampaign.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    charityOrgId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'charity_org_id',
        references: {
            model: 'charity_organizations',
            key: 'id',
        },
    },
    title: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    distributedAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        field: 'distributed_amount',
    },
    goalAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: true,
        field: 'goal_amount',
    },
    currentAmount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00,
        field: 'current_amount',
    },
    startDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'start_date',
    },
    endDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'end_date',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'created_at',
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: 'updated_at',
    },
}, {
    sequelize: database_1.default,
    tableName: 'charity_campaigns',
    timestamps: true,
});
CharityOrganization_1.default.hasMany(CharityCampaign, { foreignKey: 'charity_org_id' });
CharityCampaign.belongsTo(CharityOrganization_1.default, { foreignKey: 'charity_org_id' });
exports.default = CharityCampaign;
