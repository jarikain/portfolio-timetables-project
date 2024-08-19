import { Router } from 'express';
import { getTimetables } from '../controllers/timetables.js';

const router = Router();

router.get('/timetables', getTimetables);

export default router;
