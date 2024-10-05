import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { Sequelize } from 'sequelize';

// Initialize Sequelize
const sequelize = new Sequelize('charity', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql'
});

// Sync all models
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((error) => {
    console.error('Unable to create tables:', error);
  });
  
const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('', authRoutes);

export default app;
