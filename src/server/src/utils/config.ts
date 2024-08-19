import dotenv from 'dotenv';
import logger from './logger.js';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    logger.error(`Environment variable ${key} is required`);
    process.exit(1);
  }
  return value;
}

export const SESSION_SECRET = requireEnv('SESSION_SECRET');
export const DIGITRANSIT_API_KEY = requireEnv('DIGITRANSIT_API_KEY');
export const WEATHER_API_KEY = requireEnv('WEATHER_API_KEY');

export const PORT = Number(process.env.PORT) || 3000;
export const trainStationName = 'Lahti';
export const trainBuffer = 3;
export const SERVER_API_UPDATE_SECONDS = Number(requireEnv('SERVER_API_UPDATE_INTERVAL_SECONDS'));
export const BACKUP_UPDATE_TIME = process.env.BACKUP_UPDATE_TIME || '0 3 * * *';

logger.info('Environment variables loaded successfully');
