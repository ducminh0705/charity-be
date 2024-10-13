import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import CharityCampaign from './CharityCampaign';

class Donation extends Model {
  public id!: number;
  public donorId!: number;
  public campaignId!: number;
  public locationId?: number;
  public amount!: number;
  public method!: string;
  public transactionId?: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public User?: User;
}

Donation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    donorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'donor_id',
      references: {
        model: User,
        key: 'id',
      },
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
    locationId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'location_id',
      references: {
        model: 'locations',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed'),
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
    tableName: 'donations',
    timestamps: true,
  }
);

Donation.belongsTo(User, { foreignKey: 'userId', as: 'User' });

export default Donation;