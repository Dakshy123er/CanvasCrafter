import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authroutes.js';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postroutes.js';
import dalleRoutes from './routes/dalleroutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.send('Hello from AI Image Generator Backend!');
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () =>
      console.log('✅ Server started on http://localhost:8080')
    );
  } catch (error) {
    console.error(error);
  }
};

startServer();
