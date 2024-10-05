import admin from '../config/firebase';
import User from '../models/User';
import axios from 'axios';
import { Request, Response } from 'express';

export const sendOTP = async (req: Request, res: Response) => {
    const { phoneNumber, recaptchaToken } = req.body as unknown as { phoneNumber: string; recaptchaToken: string };
  
    try {
      const apiKey = process.env.FIREBASE_API_KEY;
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendVerificationCode?key=${apiKey}`;
  
      const response = await axios.post(url, {
        phoneNumber,
        recaptchaToken,
      });
  
      const sessionInfo = response.data.sessionInfo;
  
      res.status(200).json({ sessionInfo });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending OTP:', error.response?.data);
        res.status(500).json({ message: 'Failed to send OTP', error: error.response?.data });
      } else {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Failed to send OTP', error: String(error) });
      }
    }
  };