import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class CharityOrganization extends Model {
  public id!: number;
  public userId!: number;
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
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
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

export default CharityOrganization;