"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const CharityCampaign_1 = __importDefault(require("./CharityCampaign"));
class Location extends sequelize_1.Model {
}
Location.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
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
    name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    latitude: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: false,
    },
    longitude: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: false,
    },
    damageLevel: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'damage_level',
        validate: {
            min: 1,
            max: 5,
        },
    },
    needsHelp: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'needs_help',
    },
    ward: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    district: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    province: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
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
    tableName: 'locations',
    timestamps: true,
});
CharityCampaign_1.default.hasMany(Location, { foreignKey: 'campaign_id' });
Location.belongsTo(CharityCampaign_1.default, { foreignKey: 'campaign_id' });
exports.default = Location;
