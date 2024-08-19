import 'reflect-metadata';
import app from './app.js';
import logger from './utils/logger.js';
import { BACKUP_UPDATE_TIME, PORT, SERVER_API_UPDATE_SECONDS } from './utils/config.js';
import Cache from './utils/cache.js';
import { DatabaseService } from './services/databaseService.js';
import { DataFetcher, BackupDataFetcher } from './services/dataFetcher.js';

const databaseService = await DatabaseService.getInstance();

if (await databaseService.datasourceIsEmpty()) {
  await databaseService.executeSqlScript('populate_db.sql');
  await databaseService.executeSqlScript('populate_db_lappeenranta.sql');
}

const cache = Cache.getInstance();
const updateTime = SERVER_API_UPDATE_SECONDS * 1000;
DataFetcher.initialize(cache, updateTime, databaseService);
BackupDataFetcher.initialize(cache, BACKUP_UPDATE_TIME, databaseService);

try {
  await DataFetcher.getInstance().start();
  await BackupDataFetcher.getInstance().start();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
} catch (error) {
  logger.error('Error starting API Server application', error);
}
