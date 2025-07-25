import mongoose from 'mongoose';
import app from './app';
import config from './app/config';
import { connectRedis } from './app/config/redis';

// Connect to Redis
connectRedis()
  .then(() => {
    console.log('✅ Connected to Redis');
  })
  .catch(err => {
    console.error('❌ Failed to connect to Redis:', err);
  });

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('✅ Connected to MongoDB');

    app.listen(config.port, () => {
      console.log(`🚀 App is listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}

main();
