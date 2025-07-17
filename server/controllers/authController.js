import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../mongodb/models/user.js';
import crypto from 'crypto';
import { sendEmail } from '../utils/mailer.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';


// routes/user.js or controllers/userController.js

export const getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({
    name: user.name,
    email: user.email,
    imageGenerationCount: user.imageGenerationCount,
    isUpgraded: user.isUpgraded,
  });
};


export const register = async (req, res) => {
  console.log('🔁 Register endpoint hit');
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes


   const user = await User.create({
  name,
  email,
  password: hashedPassword,
  emailVerified: false,
  verificationCode,
  verificationCodeExpires: codeExpires,
  });

  await sendEmail({
  to: email,
  subject: 'Your Verification Code',
  html: `<p>Hello ${name},</p><p>Your verification code is <strong>${verificationCode}</strong>. It will expire in 10 minutes.</p>`,
});


    res.status(201).json({ message: 'Signup successful! Check your email for the verification code.' });
  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({ message: 'Failed to register user', error: err.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.emailVerified)
      return res.status(400).json({ message: 'Email already verified' });

    if (
      !user.verificationCode ||
      user.verificationCode !== code ||
      user.codeExpiresAt < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.emailVerified = true;
    user.verificationCode = undefined;
    user.codeExpiresAt = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '3d' });

    return res.status(200).json({
      message: 'Email verified successfully',
      });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
};
