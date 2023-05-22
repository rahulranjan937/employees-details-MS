import dotenv from 'dotenv';
import mysql from 'mysql2';

dotenv.config();

const connectDB = async () => {
  try {
    const connection = mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to the database');
    return connection;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

export { connectDB };
