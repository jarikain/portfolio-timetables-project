import Cache from '../utils/cache.js';
import cron from 'node-cron';
import { parseLocationSettings } from '../utils/transformUtilities.js';
import TrainApi from './trainApi.js';
import BusApi from './busApi.js';
import logger from '../utils/logger.js';
import { LocationSettings } from '../types/utilityTypes.js';
import { DatabaseService } from './databaseService.js';
import { getWeather } from './weatherApi.js';

/**
 * DataFetcher will get all configurations for Locations, it then makes public
 * timetable API calls and deposits the answers (JSONs) to Cache instance.
 * This cycle is run in intervals.
 *
 * Instance of DataFetcher is started at entry point (./index.ts).
 */
export class DataFetcher {
  private static instance: DataFetcher | null = null;
  private cache: Cache;
  private databaseService: DatabaseService;
  private isRunning: boolean;
  private interval: NodeJS.Timeout | null = null;
  private readonly intervalTime: number;

  private constructor(cache: Cache, intervalTime: number, databaseService: DatabaseService) {
    this.databaseService = databaseService;
    this.cache = cache;
    this.intervalTime = intervalTime;
    this.isRunning = false;
  }

  public static initialize(
    cache: Cache,
    intervalTime: number,
    databaseService: DatabaseService
  ): void {
    if (!DataFetcher.instance) {
      DataFetcher.instance = new DataFetcher(cache, intervalTime, databaseService);
    }
  }

  public static getInstance(): DataFetcher {
    if (!DataFetcher.instance) {
      throw new Error('DataFetcher has not been initialized. Call initialize() first.');
    }
    return DataFetcher.instance;
  }

  public async start(): Promise<void> {
    if (!this.isRunning) {
      this.interval = setInterval(
        // Bind 'this' to ensure correct context within updateCache
        this.updateCache.bind(this),
        this.intervalTime
      );
      this.isRunning = true;

      await this.updateCache();

      logger.info('DataFetcher is running');
    }
  }

  public async updateCache(): Promise<void> {
    const locations = await this.databaseService.getAllLocationsWithRelations();
    const locationSettings = parseLocationSettings(locations);

    for await (const settings of locationSettings) {
      const busApiResponse = await this._getBusResponse(settings);
      const trainApiResponse = await this._getTrainResponse(settings);
      const weatherResponse = await this._getWeatherResponse(settings);

      this.cache.setShortTerm(settings.locationId, {
        timestamp: new Date(),
        updateInterval: settings.updateInterval,
        bus: {
          content: busApiResponse,
          title: settings.bus?.titles
        },
        train: {
          content: trainApiResponse,
          title: settings.train?.title
        },
        locationSettings: settings,
        weather: weatherResponse
      });
    }
  }

  protected async _getBusResponse(settings: LocationSettings) {
    const busIds = settings.bus?.ids;
    const trips = settings.bus?.trips;
    const busApi = new BusApi();

    if (busIds && trips) {
      try {
        return await busApi.fetchBusData(busIds, trips);
      } catch (error) {
        logger.error('Failed to retrieve DigiTransit (bus) API response', error);
      }
    }

    return null;
  }

  protected async _getTrainResponse(settings: LocationSettings) {
    const trainId = settings.train?.id;
    const trips = settings.train?.trips;
    const trainApi = new TrainApi();

    if (trainId && trips) {
      try {
        return await trainApi.fetchTrainData(trainId, trips);
      } catch (error) {
        logger.error('Failed to retrieve DigiTraffic (train) API response', error);
      }
    }

    return null;
  }

  protected async _getWeatherResponse(settings: LocationSettings) {
    const city = settings.city;

    try {
      return await getWeather(city);
    } catch (error) {
      logger.error('Failed to retrieve weather API response', error);
    }

    return null;
  }
}

// Backup data fetcher

export class BackupDataFetcher {
  private static instance: BackupDataFetcher | null = null;
  private cache: Cache;
  private databaseService: DatabaseService;
  private readonly cronjob: string;

  private constructor(cache: Cache, cronjob: string, databaseService: DatabaseService) {
    this.databaseService = databaseService;
    this.cache = cache;
    this.cronjob = cronjob;
  }

  public static initialize(cache: Cache, cronjob: string, databaseService: DatabaseService): void {
    if (!BackupDataFetcher.instance) {
      BackupDataFetcher.instance = new BackupDataFetcher(cache, cronjob, databaseService);
    }
  }

  public static getInstance(): BackupDataFetcher {
    if (!BackupDataFetcher.instance) {
      throw new Error('BackupDataFetcher has not been initialized. Call initialize() first.');
    }
    return BackupDataFetcher.instance;
  }

  public async start(): Promise<void> {
    logger.info('Backup DataFetcher is running.');

    await this.updateBackupCache();

    cron.schedule(
      this.cronjob,
      async () => {
        const now = new Date();
        logger.info(now.toLocaleTimeString('fi-FI') + ' Asking for new backupData');
        await this.updateBackupCache();
      },
      {
        timezone: 'Europe/Helsinki'
      }
    );
  }

  public async updateBackupCache() {
    const locations = await this.databaseService.getAllLocationsWithRelations();
    const locationSettings = parseLocationSettings(locations);

    for await (const settings of locationSettings) {
      try {
        const busApiResponse = await this._getBackupBusResponse(settings);
        const trainApiResponse = await this._getBackupTrainResponse(settings);

        this.cache.setLongTerm(settings.locationId, {
          timestamp: new Date(),
          updateInterval: settings.updateInterval,
          bus: {
            content: busApiResponse,
            title: settings.bus?.titles
          },
          train: {
            content: trainApiResponse,
            title: settings.train?.title
          },
          locationSettings: settings,
          weather: null
        });
      } catch (error) {
        logger.error('Error fetching bus/train API responses', error);
      }
    }
  }

  protected async _getBackupBusResponse(settings: LocationSettings) {
    const busIds = settings.bus?.ids;
    const busApi = new BusApi();

    if (busIds) {
      try {
        return await busApi.getBackupBusTimetable(busIds);
      } catch (error) {
        logger.error('Failed to retrieve backup DigiTransit (bus) API response');
      }
    }

    return null;
  }

  protected async _getBackupTrainResponse(settings: LocationSettings) {
    const trainId = settings.train?.id;
    const trainApi = new TrainApi();

    if (trainId) {
      try {
        return await trainApi.getBackupTrainTimetable(trainId);
      } catch (error) {
        logger.error('Failed to retrieve backup DigiTraffic (train) API response');
      }
    }

    return null;
  }
}
