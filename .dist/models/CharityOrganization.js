"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class CharityOrganization extends sequelize_1.Model {
}
CharityOrganization.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,
        field: 'user_id',
        references: {
            model: 'users',
            key: 'id',
        },
    },
    organizationName: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'organization_name',
    },
    licenseDocument: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        field: 'license_document',
    },
    isApproved: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_approved',
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
    tableName: 'charity_organizations',
    timestamps: true,
});
CharityOrganization.belongsTo(User_1.default, { foreignKey: 'userId' });
User_1.default.hasOne(CharityOrganization, { foreignKey: 'userId' });
exports.default = CharityOrganization;
