import dotenv from 'dotenv';
dotenv.config();

export const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/test-sync',
  mongoDb: process.env.MONGO_DB || 'test-sync',
  mongoCollection: process.env.MONGO_COLLECTION || 'users',
  elasticUri: process.env.ELASTIC_URI || 'http://localhost:9200',
  elasticIndex: process.env.ELASTIC_INDEX || 'users_index'
};