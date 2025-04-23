import { startWatcher, initialSync } from '../mongo/watcher';
import { logger } from '../logger';

(async () => {
  try {
    logger.info('Starting Mongo -> Elasticsearch sync...');
    await initialSync(); // Only runs if necessary
    await startWatcher(); // Always runs for real-time sync
  } catch (err) {
    logger.error('Fatal error:', err);
    process.exit(1);
  }
})();