import { Router } from 'express';
import { isAuthenticated } from '../utils/middleware.js';
import {
  deleteAllInfoscreenEntities,
  deleteDevice,
  deleteLocation,
  deleteStop,
  deleteView,
  flushCache,
  getDevices,
  getLocations,
  postDevice,
  postLocation,
  postStop,
  postView
} from '../controllers/infoscreens.js';

const router = Router();

router.get('/location', isAuthenticated, getLocations);
router.post('/location', isAuthenticated, postLocation);
router.delete('/location/:id', isAuthenticated, deleteLocation);

router.get('/device', isAuthenticated, getDevices);
router.post('/device', isAuthenticated, postDevice);
router.delete('/device/:id', isAuthenticated, deleteDevice);

router.post('/view', isAuthenticated, postView);
router.delete('/view/:id', isAuthenticated, deleteView);

router.post('/stop', isAuthenticated, postStop);
router.delete('/stop/:id', isAuthenticated, deleteStop);

router.post('/flushcache', isAuthenticated, flushCache);
router.delete('/delete-all-settings', isAuthenticated, deleteAllInfoscreenEntities);

export default router;
