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
      field: 'user_id',
    },
    otpCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      field: 'otp_code',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'expires_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'otp_verification',
    timestamps: false,
  }
);

export default OTPVerification;