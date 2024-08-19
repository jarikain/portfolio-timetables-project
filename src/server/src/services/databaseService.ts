import { DataSource, ObjectLiteral, ObjectType, Repository } from 'typeorm';
import { Device, Location, Stop, View } from '../models/infoscreen.js';
import { getDatasourceConnection } from '../utils/database.js';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';
import { fileURLToPath } from 'url';
import { AdminUser } from '../models/admin.js';

/**
 * This module abstracts most common database queries
 * and exposes access to entity Repositories.
 */
export class DatabaseService {
  private static instance: DatabaseService;
  private dataSource: DataSource;

  private constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  public static async getInstance() {
    if (!DatabaseService.instance) {
      const datasource = await getDatasourceConnection();
      DatabaseService.instance = new DatabaseService(datasource);
    }
    return DatabaseService.instance;
  }

  getRepository<T extends ObjectLiteral>(entityClass: ObjectType<T>): Repository<T> {
    return this.dataSource.getRepository(entityClass);
  }

  async datasourceIsEmpty(): Promise<boolean> {
    const models = [Device, Location, View, Stop];
    const results = [];

    for (const model of models) {
      const repo = this.getRepository(model);
      const rows = await repo.count();
      results.push(rows);
    }

    return results.every((result) => result === 0);
  }

  async getLocationById(id: number): Promise<Location | null> {
    const locationRepo = this.getRepository(Location);
    const location = locationRepo.findOne({
      where: {
        id
      }
    });
    return location;
  }

  async getAllLocationsWithRelations(): Promise<Location[]> {
    try {
      const locationRepo = this.getRepository(Location);
      const locations = await locationRepo.find({
        relations: ['devices', 'views', 'views.stops'],
        order: { views: { stops: { id: 'ASC' } } }
      });
      return locations || [];
    } catch (error) {
      return [];
    }
  }

  async getLocationByIp(ip: string | undefined): Promise<Location> {
    const deviceRepo = this.getRepository(Device);
    const device = await deviceRepo.findOne({
      where: { ip },
      relations: ['location']
    });

    // Note: findOne returns answer even if device = undefined!
    // The first location (by id) is returned.
    // This is a bug in the TypeORM library.
    const locationRepo = this.getRepository(Location);
    const location = await locationRepo.findOne({
      where: { id: device?.location.id },
      relations: ['devices', 'views', 'views.stops'],
      order: { views: { stops: { id: 'ASC' } } }
    });

    return location || new Location();
  }

  async executeSqlScript(script: string): Promise<void> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const fullPath = path.join(__dirname, '..', '..', 'scripts', script);

    try {
      const sqlScript = fs.readFileSync(fullPath, 'utf-8').replaceAll('\n', ' ');
      const queries = sqlScript.split(';');

      for (const query of queries) {
        if (query.trim() !== '') {
          await this.dataSource.query(query);
        }
      }
    } catch (error) {
      logger.error(`Error executing SQL script ${fullPath}`, error);
      throw error;
    }
  }

  async hasUser(): Promise<boolean> {
    const adminRepo = this.getRepository(AdminUser);
    const users = await adminRepo.find();

    return users.length > 0;
  }
}
