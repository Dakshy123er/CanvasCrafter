import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  name: String,
  prompt: String,
  photo: String,              // public URL from Cloudinary
  cloudinary_id: String,      // ADD this line to store Cloudinary ID
});


const Post = mongoose.model('Post', PostSchema);

export default Post;
