import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class CharityOrganization extends Model {
  public id!: number;
  public userPhone!: number;
  public organizationName!: string;
  public licenseDocument!: string;
  public isApproved!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CharityOrganization.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userPhone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      field: 'phone_number',
      references: {
        model: 'users',
        key: 'phone_number',
      },
    },
    organizationName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'organization_name',
    },
    licenseDocument: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'license_document',
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_approved',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'charity_organizations',
    timestamps: true,
  }
);

CharityOrganization.belongsTo(User, { foreignKey: 'userPhone' });
User.hasOne(CharityOrganization, { foreignKey: 'userPhone' });

export default CharityOrganization;