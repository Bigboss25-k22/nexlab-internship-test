import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AppDataSource } from './config/data-source';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

app.get('/', (_req, res) => {
  res.json({ message: 'Nexlab API is running!' });
});

app.use(notFoundHandler);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });
