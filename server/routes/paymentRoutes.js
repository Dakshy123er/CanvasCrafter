import express from 'express';
import Razorpay from 'razorpay';
import * as dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/v1/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: 9900, // ₹99 in paise
      currency: 'INR',
      receipt: crypto.randomBytes(10).toString('hex'),
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.error('❌ Razorpay order creation failed:', err.message);
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

export default router;
