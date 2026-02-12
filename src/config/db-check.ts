import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const checkDatabaseConnection = async () => {
  const dataSource = new DataSource({
    type: 'mongodb',
    url: process.env.MONGO_URI
  });

  try {
    await dataSource.initialize();
    console.log(' Database connection successful');
  } catch (err) {
    console.error(' Database connection failed:', err.message);
    process.exit(1); 
  }
};
