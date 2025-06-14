import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
dotenv.config();

import userRouter from '@/routes/userRoutes.ts';

const app = express();
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
