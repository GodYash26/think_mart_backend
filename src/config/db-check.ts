import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const checkDatabaseConnection = async () => {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'thinkmart',
    password: process.env.DB_PASSWORD || 'thinkmart',
    database: process.env.DB_NAME || 'thinkmart_db',
  });

  try {
    await dataSource.initialize();
    console.log(' Database connection successful');
  } catch (err) {
    console.error(' Database connection failed:', err.message);
    process.exit(1); 
  }
};
