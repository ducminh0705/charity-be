"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
const CharityCampaign_1 = __importDefault(require("./CharityCampaign"));
const Location_1 = __importDefault(require("./Location"));
class Donation extends sequelize_1.Model {
}
Donation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    donorId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'donor_id',
        references: {
            model: User_1.default,
            key: 'id',
        },
    },
    campaignId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'campaign_id',
        references: {
            model: CharityCampaign_1.default,
            key: 'id',
        },
    },
    locationId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'location_id',
        references: {
            model: 'locations',
            key: 'id',
        },
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    method: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    transactionId: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'transaction_id',
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'completed', 'failed'),
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
    tableName: 'donations',
    timestamps: true,
});
Donation.belongsTo(User_1.default, { foreignKey: 'donorId', as: 'User' });
User_1.default.hasMany(Donation, { foreignKey: 'donorId' });
Donation.belongsTo(CharityCampaign_1.default, { foreignKey: 'campaignId', as: 'CharityCampaign' });
CharityCampaign_1.default.hasMany(Donation, { foreignKey: 'campaignId' });
Donation.belongsTo(Location_1.default, { foreignKey: 'locationId', as: 'Location' });
Location_1.default.hasMany(Donation, { foreignKey: 'locationId' });
exports.default = Donation;
