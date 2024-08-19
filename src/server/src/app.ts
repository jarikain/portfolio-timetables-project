import express from 'express';
import 'express-async-errors';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import { configurePassport } from './utils/passport.js';
import timetableRoutes from './routes/timetableRoutes.js';
import infoscreenRoutes from './routes/infoscreenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './utils/middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './utils/logger.js';
import { PORT, SESSION_SECRET } from './utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

const FileStoreSession = FileStore(session);
const secondsInDay = 86400;
const secondsInHour = 3600;
app.use(
  session({
    store: new FileStoreSession({
      path: path.join(__dirname, '..', 'session-data'),
      ttl: secondsInDay,
      reapInterval: secondsInHour,
      retries: 0,
      fileExtension: '.sess',
      logFn: () => {}
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use('/api/v1/', timetableRoutes);
app.use('/api/v1/', infoscreenRoutes);
app.use('/api/v1/', adminRoutes);

app.use('/hallinta', express.static(path.join(__dirname, '..', '..', 'adminPanel', 'dist')));
app.get('/hallinta/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'adminPanel', 'dist', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', '..', 'client', 'dist')));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.startsWith('/hallinta')) {
    res.sendFile(path.join(__dirname, '..', '..', 'client', 'dist', 'index.html'));
  }
});

if (process.env.NODE_ENV === 'development') {
  logger.info(`Serving admin panel at: http://localhost:${PORT}/hallinta`);
  logger.info(`Serving client at: http://localhost:${PORT}`);
}

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
