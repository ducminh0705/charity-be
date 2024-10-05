import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class OTPVerification extends Model {
  public id!: number;
  public userId!: number;
  public otpCode!: string;
  public expiresAt!: Date;
  public readonly createdAt!: Date;
}

OTPVerification.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    otpCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'otp_verification',
    timestamps: false,
  }
);

export default OTPVerification;