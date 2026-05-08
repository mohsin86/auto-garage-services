// File: src/config/test-connection.ts

import AppDataSource from './data-source';

async function test() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

test();