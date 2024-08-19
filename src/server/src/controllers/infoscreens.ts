import { Device, Location, Stop, View } from '../models/infoscreen.js';
import { responseToDelete, responseToGet, responseToPost } from '../utils/middleware.js';
import { BackupDataFetcher, DataFetcher } from '../services/dataFetcher.js';
import { RefreshManager } from '../utils/RefreshManager.js';
import { DatabaseService } from '../services/databaseService.js';
import { Request, Response } from 'express';
import logger from '../utils/logger.js';

/**
 * GET /location - all locations with or without relations
 * @param req
 * @param res
 * @queryparam {boolean} [relations=false] - If true include related entities in the response.
 */
export async function getLocations(req: Request, res: Response): Promise<void> {
  const useRelations = req.query.relations === 'true';
  const relations = useRelations ? ['devices', 'views', 'views.stops'] : [];
  const options = {
    relations,
    order: {
      id: 'ASC',
      devices: { id: 'ASC' },
      views: {
        id: 'ASC',
        stops: { id: 'ASC' }
      }
    }
  };
  await responseToGet(req, res, Location, options);
}

export async function postLocation(req: Request, res: Response): Promise<void> {
  await responseToPost(req, res, Location);
}

/**
 * DELETE /location/:id - Delete a location by its ID.
 * @param req
 * @param res
 */
export async function deleteLocation(req: Request, res: Response): Promise<void> {
  await responseToDelete(req, res, Location);
}

/**
 * GET /device - all devices
 * @param req
 * @param res
 * @queryparam {boolean} [relations=false] - If true include related entities in the response.
 */
export async function getDevices(req: Request, res: Response): Promise<void> {
  const useRelations = req.query.relations === 'true';
  const relations = useRelations ? ['location'] : [];

  await responseToGet(req, res, Device, { relations });
}

export async function postDevice(req: Request, res: Response): Promise<void> {
  await responseToPost(req, res, Device);
}

/**
 * DELETE /device/:id - Delete a device by its ID.
 * @param req
 * @param res
 */
export async function deleteDevice(req: Request, res: Response): Promise<void> {
  await responseToDelete(req, res, Device);
}

export async function postView(req: Request, res: Response): Promise<void> {
  await responseToPost(req, res, View);
}

/**
 * DELETE /view/:id - Delete a device by its ID.
 * @param req
 * @param res
 */
export async function deleteView(req: Request, res: Response): Promise<void> {
  await responseToDelete(req, res, View);
}

export async function postStop(req: Request, res: Response): Promise<void> {
  await responseToPost(req, res, Stop);
}

/**
 * DELETE /stop/:id - Delete a device by its ID.
 * @param req
 * @param res
 */
export async function deleteStop(req: Request, res: Response): Promise<void> {
  await responseToDelete(req, res, Stop);
}

export async function flushCache(_req: Request, res: Response): Promise<void> {
  await DataFetcher.getInstance().updateCache();
  await BackupDataFetcher.getInstance().updateBackupCache();

  RefreshManager.getInstance().start();

  res.status(200).json({ message: 'Cache flushed successfully' });
}

export async function deleteAllInfoscreenEntities(_req: Request, res: Response): Promise<void> {
  try {
    const databaseService = await DatabaseService.getInstance();

    await databaseService.getRepository(Stop).delete({});
    await databaseService.getRepository(View).delete({});
    await databaseService.getRepository(Device).delete({});
    await databaseService.getRepository(Location).delete({});

    res.status(200).json({ message: 'All infoscreen entities have been deleted successfully.' });
  } catch (error) {
    logger.error('Error deleting all infoscreen entities:', error);
    res.status(500).json({ message: 'An error occurred while deleting infoscreen entities.' });
  }
}
