import 'express-async-errors';
import createDatabaseConnection from './database/connection';
import notFoundHandler from './middleware/application/notFoundHandler';
import errorHandler from './middleware/application/errorHandler';
import { generalLogger } from './lib/logger';

const createRedisConnection = async () => {
  const redis = (await import('./database/redis')).default;

  return new Promise((resolve, reject) => {
    redis.on('connect', () => {
      generalLogger.info('connected to redis server');
      resolve(true);
    });
    redis.on('error', (error) => {
      generalLogger.error('error connecting to redis', {
        error,
      });
      reject(error);
    });
  });
};

export default async () => {
  await createRedisConnection();
  await createDatabaseConnection();

  const app = (await import('./app')).default;
  const router = (await import('./router')).default;

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);
};
