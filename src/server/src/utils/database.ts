import { DataSource, DataSourceOptions } from 'typeorm';
import * as DeviceModels from '../models/infoscreen.js';
import * as AdminModels from '../models/admin.js';
import logger from './logger.js';

/**
 * Singleton module to handle data source (database) connection.
 */
class AppDataSource extends DataSource {
  async init(): Promise<DataSource> {
    try {
      logger.info('Data Source initialized');
      return await this.initialize();
    } catch (error) {
      logger.error('Error initializing Data Source', error);
      return this;
    }
  }
}

const deviceEntities = Object.values(DeviceModels);
const adminEntities = Object.values(AdminModels);
const entities = [...deviceEntities, ...adminEntities];

const database = process.env.NODE_ENV === 'development' ? './dev-db.sqlite' : './prod-db.sqlite';

const options: DataSourceOptions = {
  type: 'sqlite',
  entities,
  synchronize: true,
  database
};

let connectionInstance: DataSource;

export async function getDatasourceConnection() {
  if (!connectionInstance) {
    const appDatasource = new AppDataSource(options);
    connectionInstance = await appDatasource.init();
  }
  return connectionInstance;
}
