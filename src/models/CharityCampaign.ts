import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import CharityOrganization from './CharityOrganization';

class CharityCampaign extends Model {
  public id!: number;
  public charityOrgId!: number;
  public title!: string;
  public description?: string;
  public goalAmount?: number;
  public currentAmount?: number;
  public startDate?: Date;
  public endDate?: Date;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CharityCampaign.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    charityOrgId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'charity_org_id',
      references: {
        model: 'charity_organizations',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goalAmount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      field: 'goal_amount',
    },
    currentAmount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.00,
      field: 'current_amount',
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'start_date',
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'end_date',
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'cancelled'),
      defaultValue: 'pending',
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
    tableName: 'charity_campaigns',
    timestamps: true,
  }
);

CharityOrganization.hasMany(CharityCampaign, { foreignKey: 'charity_org_id' });
CharityCampaign.belongsTo(CharityOrganization, { foreignKey: 'charity_org_id' });

export default CharityCampaign;