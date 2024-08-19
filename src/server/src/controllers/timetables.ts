import { Request, Response } from 'express';
import {
  makeFinalJson,
  processBackupBusData,
  processTrainData,
  transformBusData
} from '../services/timetableTransformer.js';
import Cache from '../utils/cache.js';
import { transformToIpv4 } from '../utils/transformUtilities.js';
import logger from '../utils/logger.js';
import { DatabaseService } from '../services/databaseService.js';
import { CacheValue } from '../types/cacheTypes.js';
import { ApiResponse, DigiTrafficResponce } from '../types/apiResponceTypes.js';
import { OutputContent, TransformedData, weatherOut } from '../types/dataTypes.js';
import { RefreshManager } from '../utils/RefreshManager.js';

export async function getTimetables(req: Request, res: Response): Promise<void> {
  const ip = transformToIpv4(req.ip) || req.ip;
  const databaseService = await DatabaseService.getInstance();
  const location = await databaseService.getLocationByIp(ip);
  const cache = Cache.getInstance();
  const cachedData = cache.getShortTerm(location.id);
  const backupCachedData = cache.getLongTerm(location.id);
  let train;

  const bus = getProcessedBus(cachedData, backupCachedData);
  if (cachedData?.locationSettings.train !== null) {
    train = getProcessedTrain(cachedData, backupCachedData);
  } else {
    train = null;
  }
  const weather = getWeather(cachedData?.weather as weatherOut);

  try {
    const finalJson = makeFinalJson(weather, bus, train, cachedData?.locationSettings, ip);
    RefreshManager.getInstance().addIp(ip);
    res.json(finalJson);
  } catch (error) {
    logger.error('Fatal error responding request. Check logs for errors', error);
    res.status(500).json({ error: 'Fatal server error. Contact support' });
  }
}

function getProcessedBus(
  cachedData: CacheValue | undefined,
  backupCachedData: CacheValue | undefined
): TransformedData | null {
  if (cachedData?.bus?.content) {
    // Jos bussi data löytyy käytetään main dataa.
    const transformedBus = transformBusData(
      cachedData.bus.content as ApiResponse,
      cachedData.bus.title as string[]
    );
    return transformedBus;
  }
  if (backupCachedData?.bus?.content) {
    // Jos bussi dataa ei löydy käytetään backup dataa.
    const now = new Date();
    const busTrips = cachedData?.locationSettings?.bus?.trips[0] || 0;
    const processedBus = processBackupBusData(
      backupCachedData.bus.content as ApiResponse,
      busTrips,
      now
    );
    const finalBus = transformBusData(processedBus, backupCachedData.bus.title as string[]);
    logger.error('Cached bus data not found. Using backupCache.');
    return finalBus;
  }
  logger.error('Backup bus data not found. Returning null.');
  return null;
}

function getProcessedTrain(
  data: CacheValue | undefined,
  bdata: CacheValue | undefined
): OutputContent | null {
  if (data?.train?.content) {
    // Jos junat data löytyy käytetään main dataa.
    const transformedTrain = processTrainData(
      data.train.content as DigiTrafficResponce,
      data.train.title as string,
      data.locationSettings.train?.id
    );
    return transformedTrain;
  }
  if (bdata?.train?.content) {
    // Jos junat dataa ei löytykään käytetään backup dataa.
    const trainTrips = data?.locationSettings.train?.trips || 0;

    const processedTrain = processTrainData(
      bdata.train.content as DigiTrafficResponce,
      bdata.train.title as string,
      bdata.locationSettings.train?.id,
      trainTrips
    );

    logger.error('Cache train data not found. Using backupCache.');
    return processedTrain;
  }
  logger.error('Backup train data not found. Returning null.');
  return null;
}
function getWeather(data: weatherOut): weatherOut | null {
  if (data) {
    return data;
  }
  logger.error('Cached weather data not found. Returning null.');
  return null;
}
