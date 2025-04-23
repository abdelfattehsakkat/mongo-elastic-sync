import { Client } from '@elastic/elasticsearch';
import { config } from '../config';

export const elasticClient = new Client({ node: config.elasticUri });
