import dotenv from 'dotenv';

dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sevaconnect',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  QDRANT_URL: process.env.QDRANT_URL || '',
  QDRANT_API_KEY: process.env.QDRANT_API_KEY || '',
};

export default env;
