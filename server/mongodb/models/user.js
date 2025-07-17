import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageGenerationCount: {
      type: Number,
      default: 0,
    },
    hasPaid: {
      type: Boolean,
      default: false,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
    },
    codeExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);
