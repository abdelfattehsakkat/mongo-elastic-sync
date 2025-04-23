import { MongoClient } from 'mongodb';
import { config } from '../config';
import { mapDocument } from '../mapper';
import { indexDocument } from '../elastic/writer';
import { elasticClient } from '../elastic/elastic';

import { logger } from '../logger';


export const initialSync = async () => {
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  const db = client.db(config.mongoDb);
  const collection = db.collection(config.mongoCollection);

  const count = await elasticClient.count({ index: config.elasticIndex });
  if (count.count > 0 && !process.env.FORCE_SYNC) {
    logger.info("Elasticsearch already has documents. Skipping initial sync.");
    return;
  }

  const docs = await collection.find().toArray();
  logger.info(`Initial sync: indexing ${docs.length} documents`);
  for (const doc of docs) {
    const mapped = mapDocument(doc);
    await indexDocument(doc._id, mapped);
  }
};


export const startWatcher = async () => {
  const client = new MongoClient(config.mongoUri);
  await client.connect();
  const db = client.db(config.mongoDb);
  const collection = db.collection(config.mongoCollection);

  const changeStream = collection.watch([], { fullDocument: 'updateLookup' });

  changeStream.on('change', async (change) => {
    console.log('Change detected:');
    console.log(change);
    if (change.operationType === 'insert' || change.operationType === 'update') {
      const fullDoc = change.fullDocument;
      if (fullDoc) {
        const doc = mapDocument(fullDoc);
        await indexDocument(fullDoc._id, doc);
        logger.info(`Indexed document ${fullDoc._id}`);
      }
    } else if (change.operationType === 'delete') {
      const id = change.documentKey._id;
      // await deleteDocument(id); // to be implemented
      logger.info(`Deleted document ${id}`);
    }
  });
};

