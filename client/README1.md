# 🎨 CanvasCrafter – AI Image Generator App

CanvasCrafter is a full-stack AI image generation app using Replicate API, allowing users to generate and post AI art. It includes features like authentication, usage-based limits, payments, and email verification.

## 🚀 Live Demo
Frontend: [canvas-crafter.vercel.app](https://canvas-crafter-chi.vercel.app)  
Backend: [Render API](https://canvascrafter-oezs.onrender.com)

## 🌟 Features

- 🔐 User authentication (JWT)
- 🎨 AI-powered image generation
- 📦 30 free image generations per user
- 💳 Razorpay(Test Mode) payment integration to unlock unlimited generations
- 📥 Image download and post history
- ✉️ Email verification with OTP for signup
- 🖌️ Clean, responsive UI with TailwindCSS and Framer Motion
- - 🐢 Cold start handled using UptimeRobot (Render)

## 🛠️ Tech Stack

- **Frontend**: HTML,React.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, MongoDB, JWT
- **Authentication**: JWT, Email OTP Verification(Nodemailer)
- **Payment Gateway**: Razorpay
- **AI Image Generation**: Replicate API
- **Deployment**: Vercel (Frontend), Render (Backend)

## 🛠️ Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/your-username/ai-image-generator.git
cd ai-image-generator

# 2. Set up environment variables
cp .env.example .env

# 3. Install dependencies
cd server && npm install
cd ../client && npm install

# 4. Start the development servers
cd server && npm start
cd ../client && npm start

#Also dont forget to make a .env file in your server folder with the name .env and add the environment variables present in .env.example




