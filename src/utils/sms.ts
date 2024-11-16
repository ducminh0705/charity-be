import { Request, Response } from 'express';

export const sendOTP = function (req: Request, res: Response) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);
  const { phone } = req.query; // Extract phone from query parameters
  client.verify.v2.services(process.env.TWILIO_CLIENT_VERIFY_V2_SERVICES)
      .verifications
      .create({ to: '+84387963041', channel: 'sms' })
      // .create({ to: "+" + phone, channel: 'sms' })
      .then((verification: { status: string; }) => {
          console.log(`Verification status: ${verification.status}`);

          if (verification.status === "pending") {
              res.status(200).json({ message: 'Send OTP successful!' });
          } else {
              res.status(401).json({ message: 'Invalid Phone credentials' });
          }
      })
      .catch((err: any) => {
          console.error("Error sending OTP:", err);
          res.status(500).json({ message: 'Server error sending OTP' });
      });
  };

  export const verifyOTP = function (req: Request, res: Response) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);
    const { otp } = req.query; // Extract phone from query parameters
    client.verify.v2.services(process.env.TWILIO_CLIENT_VERIFY_V2_SERVICES)
        .verificationChecks
        .create({ to: '+84387963041', code: otp })
        .then((verification_check: { status: string; }) => {
            console.log(`Verification status: ${verification_check.status}`);
            if (verification_check.status === "approved") {
                res.status(200).json({ message: 'OTP verified successfully!' });
            } else {
                res.status(401).json({ message: 'Invalid OTP or verification failed' });
            }
        })
        .catch((err: any) => {
            console.error("Error verifying OTP:", err);
            res.status(500).json({ message: 'Server error during OTP verification' });
        });
    };