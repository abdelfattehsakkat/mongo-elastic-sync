import { MongoClient } from 'mongodb';

(async () => {
  const uri = 'mongodb://localhost:27017/test-sync';
  console.log('Trying to connect to:', uri);
  const client = new MongoClient(uri);
  await client.connect();
  console.log('✅ Connected to MongoDB!');
  await client.close();
})();