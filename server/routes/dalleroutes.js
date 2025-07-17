// server/routes/dalleRoutes.js

import express from 'express';
import * as dotenv from 'dotenv';
import Replicate from 'replicate';
import { verifyToken } from '../middleware/auth.js';
import User from '../mongodb/models/user.js'; // ✅ Import User model

dotenv.config();

const router = express.Router();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// POST /api/v1/dalle (Protected Route)
router.post('/', verifyToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // ✅ Fetch authenticated user from DB
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ Check usage limits for free users
    if (!user.hasPaid && user.imageGenerationCount >= 30) {
      return res.status(403).json({
        message: '⚠️ Free image limit reached. Please upgrade your plan.',
      });
      
    }

    // ✅ Call Replicate API
    const prediction = await replicate.predictions.create({
      version: '6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe',
      input: { prompt },
    });

    // ✅ Poll for prediction result
    let result = prediction;
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'succeeded') {
      const imageUrl = result.output?.[0];
      console.log('✅ AI image generated:', imageUrl);

      // ✅ Increment user’s image count
      user.imageGenerationCount += 1;
      await user.save();

      return res.status(200).json({ photo: imageUrl });
    } else {
      console.error('❌ Replicate failed:', result.error || 'Unknown error');
      return res.status(500).json({ error: 'Image generation failed' });
    }
  } catch (err) {
    console.error('🔥 Server error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
