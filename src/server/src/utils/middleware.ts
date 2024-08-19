import { NextFunction, Request, Response } from 'express';
import logger from './logger.js';
import { ObjectLiteral, ObjectType, QueryFailedError } from 'typeorm';
import { DatabaseService } from '../services/databaseService.js';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).send('Route does not exist!');
}

export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error('An error occurred:', error);

  if (error instanceof QueryFailedError) {
    logger.error('Database query failed:', error.message);
    res.status(500).json({
      message: 'Query failed. Internal server error'
    });
  } else if (error instanceof Error) {
    logger.error('Unexpected error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  } else {
    logger.error('Unknown error occurred');
    res.status(500).json({ error: 'Internal Server Error' });
  }

  next(error);
}

/**
 * Generic middleware function to fetch entities with or without relations.
 * @param req
 * @param res
 * @param entityClass
 * @param options
 */
export async function responseToGet<T extends ObjectLiteral>(
  req: Request,
  res: Response,
  entityClass: ObjectType<T>,
  options?: { relations?: string[]; order?: object }
): Promise<void> {
  const databaseService = await DatabaseService.getInstance();
  const repository = databaseService.getRepository(entityClass);
  const entities = await repository.find(options);

  res.json(entities);
}

/**
 * Generic middleware function to save and update entities.
 * @param req
 * @param res
 * @param entityClass
 */
export async function responseToPost<T extends ObjectLiteral>(
  req: Request,
  res: Response,
  entityClass: ObjectType<T>
): Promise<void> {
  const databaseService = await DatabaseService.getInstance();
  const repository = databaseService.getRepository(entityClass);
  const entityData = req.body as T;
  const savedEntity = await repository.save(entityData);

  res.json(savedEntity);
}

/**
 * Generic middleware function to delete entities.
 * @param req
 * @param res
 * @param entityClass
 */
export async function responseToDelete<T extends ObjectLiteral>(
  req: Request,
  res: Response,
  entityClass: ObjectType<T>
): Promise<void> {
  const databaseService = await DatabaseService.getInstance();
  const repository = databaseService.getRepository(entityClass);
  const id = Number(req.params.id);
  const result = await repository.delete(id);

  if (!result) {
    res.status(404).json({ message: "Entity doesn't exist!" });
  }

  res.status(204).json({
    message: 'Deletion successful'
  });
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}
