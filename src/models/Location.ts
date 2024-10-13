import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import CharityCampaign from './CharityCampaign';

class Location extends Model {
  public id!: number;
  public campaignId!: number;
  public name!: string;
  public latitude!: number;
  public longitude!: number;
  public damageLevel?: number;
  public needsHelp!: boolean;
  public ward?: string;
  public district?: string;
  public province?: string;
  public city?: string;
  public goalAmount?: number;
  public currentAmount?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Location.init(
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: false,
    },
    damageLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'damage_level',
      validate: {
        min: 1,
        max: 5,
      },
    },
    needsHelp: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'needs_help',
    },
    ward: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(255),
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
    tableName: 'locations',
    timestamps: true,
  }
);

CharityCampaign.hasMany(Location, { foreignKey: 'campaign_id' });
Location.belongsTo(CharityCampaign, { foreignKey: 'campaign_id' });

export default Location;