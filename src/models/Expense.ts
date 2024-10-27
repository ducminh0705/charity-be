import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import CharityCampaign from './CharityCampaign';

class Expense extends Model {
  public id!: number;
  public campaignId!: number;
  public amount!: number;
  public description?: string;
  public date!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public CharityCampaign?: CharityCampaign;
}

Expense.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    campaignId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'campaign_id',
      references: {
        model: CharityCampaign,
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
    tableName: 'expenses',
    timestamps: true,
  }
);

Expense.belongsTo(CharityCampaign, { foreignKey: 'campaignId', as: 'CharityCampaign' });
CharityCampaign.hasMany(Expense, { foreignKey: 'campaignId' });

export default Expense;
