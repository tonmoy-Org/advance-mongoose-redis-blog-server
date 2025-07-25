import { createClient } from 'redis';

const client = createClient({
  url: 'redis://localhost:6379', // Adjust this URL if your Redis server is running on a different host/port
});

client.on('error', (err) => console.error('Redis Client Error', err));

const connectRedis = async () => {
  await client.connect();
};

const setCache = async (key: string, value: any, expiry: number) => {
  await client.set(key, JSON.stringify(value), {
    EX: expiry, // Set expiry in seconds
  });
};

const getCache = async (key: string) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

export { connectRedis, setCache, getCache };