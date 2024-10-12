import { Request, Response } from 'express';
import Donation from '../models/Donation';
import stripe from '../services/stripeService';
import User from '../models/User';
import CharityCampaign from '../models/CharityCampaign';

export const createDonation = async (req: Request, res: Response) => {
  const { campaignId, amount, method } = req.body;
  const user = (req as any).user as User;

  try {
    const campaign = await CharityCampaign.findByPk(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Chiến dịch không tồn tại' });
    }

    let donation = await Donation.create({
      donorId: user.id,
      campaignId,
      amount,
      method,
      status: method === 'credit_card' ? 'pending' : 'completed',
    });

    if (method === 'credit_card') {
      // Tạo Payment Intent với Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Số tiền tính bằng cent
        currency: 'vnd',
        metadata: { donationId: donation.id.toString() },
      });

      // Lưu transaction_id (paymentIntent.id)
      donation.transactionId = paymentIntent.id;
      await donation.save();

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } else {
      // Các phương thức khác, hiển thị thông tin cần thiết
      res.status(200).json({ message: 'Vui lòng hoàn tất đóng góp của bạn' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Đã xảy ra lỗi' });
  }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }

  // Xử lý sự kiện
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const donationId = paymentIntent.metadata.donationId;

    // Cập nhật trạng thái donation
    const donation = await Donation.findByPk(donationId);
    if (donation) {
      donation.status = 'completed';
      await donation.save();
    }
  }

  res.json({ received: true });
};

// Sau khi cập nhật donation thành công
// const io = req.app.get('io');
// io.emit('newDonation', { campaignId: donation.campaignId, amount: donation.amount });
