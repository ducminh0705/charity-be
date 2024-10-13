import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { Sequelize } from 'sequelize';
import donationRoutes from './routes/donationRoutes';
import campaignRoutes from './routes/campaignRoutes';
import reportRoutes from './routes/reportRoutes';
import paymentInfoRoutes from './routes/paymentInfoRoutes';
import feedbackRoutes from './routes/feedbackRoutes';



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
app.use('/donations', donationRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/reports', reportRoutes);
app.use('/payment-info', paymentInfoRoutes);
app.use('/feedbacks', feedbackRoutes);

export default app;
