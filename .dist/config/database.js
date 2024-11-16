"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'charity', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'db_password', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    // logging: false,
    port: 3308
});
exports.default = sequelize;
