import { LocationId, CacheValue, ICache } from '../types/cacheTypes.js';

/**
 * The Cache class is a singleton that provides methods for storing and retrieving
 * API responses in a long-term and a short-term cache. The cache keys are of type Location.id
 * and the values are of type CacheValue.
 *
 * @example
 * const cache = Cache.getInstance();
 * cache.setShortTerm(locationId, apiResponse);
 * const response = cache.getShortTerm(locationId);
 *
 * @class
 */
export default class Cache implements ICache {
  private static instance: Cache;
  private longTermCache: Map<LocationId, CacheValue>;
  private shortTermCache: Map<LocationId, CacheValue>;

  private constructor(
    longTermCache: Map<LocationId, CacheValue> = new Map(),
    shortTermCache: Map<LocationId, CacheValue> = new Map()
  ) {
    this.longTermCache = longTermCache;
    this.shortTermCache = shortTermCache;
  }

  public static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  /**
   * Resets the singleton instance of the Cache class.
   * This will clear all cached data. Helps with testing.
   */
  public static resetInstance(): void {
    Cache.instance = new Cache();
  }

  deleteShortTermByKey(key: LocationId) {
    this.shortTermCache.delete(key);
  }

  getLongTerm(key: LocationId): CacheValue | undefined {
    return this.longTermCache.get(key);
  }

  getShortTerm(key: LocationId): CacheValue | undefined {
    return this.shortTermCache.get(key);
  }

  setLongTerm(key: LocationId, value: CacheValue): void {
    this.longTermCache.set(key, value);
  }

  setShortTerm(key: LocationId, value: CacheValue): void {
    this.shortTermCache.set(key, value);
  }
}
