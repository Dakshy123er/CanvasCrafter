// server/routes/postRoutes.js

import express from 'express';
import * as dotenv from 'dotenv';
import Post from '../mongodb/models/post.js';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST: Create a new post and upload image to Cloudinary (no duplicates)
router.post('/', async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;

    // Validate input
    if (!name || !prompt || !photo) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Check for duplicate photo URL
    const existingPost = await Post.findOne({ photo });

    if (existingPost) {
      return res.status(409).json({ success: false, message: 'This image has already been shared.' });
    }

    // Upload to Cloudinary
    const uploadedPhoto = await cloudinary.uploader.upload(photo, {
      folder: 'ai-image-app',
    });

    // Save to DB
    const newPost = await Post.create({
      name,
      prompt,
      photo: uploadedPhoto.secure_url,
    cloudinary_id: uploadedPhoto.public_id,
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error('❌ Error creating post:', err);
    res.status(500).json({ success: false, message: 'Unable to create post' });
  }
});

// GET: Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ _id: -1 }); // newest first
    res.status(200).json({ success: true, data: posts });
  } catch (err) {
    console.error('❌ Error fetching posts:', err);
    res.status(500).json({ success: false, message: 'Unable to fetch posts' });
  }
});

// DELETE a post by ID
// DELETE a post by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Delete image from Cloudinary
    if (post.cloudinary_id) {
      await cloudinary.uploader.destroy(post.cloudinary_id);
    }

    // Delete from MongoDB
    await post.deleteOne();

    res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting post:', err);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});



export default router;
