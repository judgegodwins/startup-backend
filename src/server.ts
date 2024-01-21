import 'reflect-metadata';
import http from 'http';
import stoppable from 'stoppable';
import { MigrationExecutor, getConnection } from 'typeorm';

import initialize from './initialize';
import config from './config';
import { generalLogger } from './lib/logger';

const runMigrations = async () => {
  generalLogger.info('Running pending migrations');

  const connection = getConnection();
  const executor = new MigrationExecutor(connection, connection.createQueryRunner());
  await executor.executePendingMigrations();
};

const startServer = async () => {
  (global as any).isStartingUp = true;

  const app = (await import('./app')).default;
  const server = stoppable(http.createServer(app));

  server.listen(config.app.port, () => {
    generalLogger.info(`! Server Started and Listening on Port: ${config.app.port} with PID: ${process.pid}`);
    (global as any).isStartingUp = false;
  });

  process.on('SIGTERM', async () => {
    (global as any).isShuttingDown = true;

    generalLogger.info('Starting graceful server shutdown');

    // wait for readiness probe to start failing before stopping the server
    await new Promise((resolve) => setTimeout(resolve, 15 * 1000));

    server.stop(() => {
      generalLogger.info('Graceful server shutdown completed');
      setTimeout(() => process.exit(0), 1000);
    });
  });
};

const start = async () => {
  try {
    await initialize();
    await runMigrations();
    // await seedAll()
    await startServer();
  } catch (e) {
    generalLogger.error(e);
    process.exit(1);
  }
};

export default start();
