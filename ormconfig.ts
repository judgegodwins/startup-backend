import { type ConnectionOptions } from 'typeorm';
import config, { AppEnvironmentEnum } from './src/config';

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  entities: [`${__dirname}/src/database/entities/*.ts`, `${__dirname}/src/database/entities/*.js`],
  migrations: [`${__dirname}/src/database/migrations/*.ts`, `${__dirname}/src/database/migrations/*.js`],
  synchronize: config.app.env === AppEnvironmentEnum.TEST,
  dropSchema: config.app.env === AppEnvironmentEnum.TEST,
  migrationsRun: config.app.env !== AppEnvironmentEnum.TEST,
  logging: false,
  logger: 'debug',
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  // timezone: 'Z',
};

export = connectionOptions;
