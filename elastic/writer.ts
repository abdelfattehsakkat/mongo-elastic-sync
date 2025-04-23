import { Client } from '@elastic/elasticsearch';
import { config } from '../config';

const client = new Client({ node: config.elasticUri });

export const indexDocument = async (id: any, doc: any) => {
  await client.index({
    index: config.elasticIndex,
    id: id.toString(),
    document: doc
  });
};