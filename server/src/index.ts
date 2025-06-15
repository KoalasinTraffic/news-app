import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

import userRouter from '@/routes/userRoutes.ts';

const allowedOrigins = ['http://localhost:3000', 'https://news-client-llen.onrender.com'];

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(cors());

app.use(express.json());
app.use('/api/user', userRouter);

const ADDR = process.env.ADDR || '0.0.0.0';
const PORT = Number(process.env.PORT) || 5000;

try {
  app.listen(PORT, ADDR, () => {
    console.log(`Listening on ${ADDR}:${PORT}...`);
  });
} catch (error) {
  console.error(error);
}
