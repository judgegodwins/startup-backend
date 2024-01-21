import env from 'dotenv';
import { join } from 'path';

env.config({
  path: process.env.ENV_FILE_PATH,
});

export enum AppEnvironmentEnum {
  TEST = 'test',
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

interface Config {
  env: {
    isProduction: boolean;
    isDevelopment: boolean;
    isTest: boolean;
  };
  app: {
    env: AppEnvironmentEnum;
    isProduction: boolean;
    name: string;
    domain: string;
    logo: string;
    secret: string;
    bcryptRounds: number;
    port: number;
    frontendDomain: string;
    templatePath: string;
  };
  db: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
  redis: {
    mode: string; // 'standalone' | 'cluster';
    host: string;
    port: number;
    password: string;
    username?: string;
    tls?: 'yes' | 'no';
  };
  sendgrid: {
    apiKey: string;
    from: string;
  };
  s3: {
    endpoint: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    region: string;
  };
}

const isTestEnvironment = process.env.APP_ENV === AppEnvironmentEnum.TEST;

const config: Config = {
  env: {
    isProduction: process.env.NODE_ENV === AppEnvironmentEnum.PRODUCTION,
    isDevelopment: process.env.NODE_ENV === AppEnvironmentEnum.DEVELOPMENT,
    isTest: process.env.NODE_ENV === AppEnvironmentEnum.TEST,
  },
  app: {
    name: process.env.APP_NAME!,
    domain: process.env.APP_DOMAIN!,
    logo: process.env.APP_LOGO!,
    env: process.env.APP_ENV as AppEnvironmentEnum,
    isProduction: process.env.APP_ENV === AppEnvironmentEnum.PRODUCTION,
    secret: process.env.APP_SECRET!,
    bcryptRounds: 10,
    port: +process.env.PORT!,
    frontendDomain: process.env.APP_FRONTEND_DOMAIN!,
    templatePath: join(__dirname, 'lib', 'mail', 'templates'),
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: +(process.env.DB_PORT || 3306),
    database: isTestEnvironment ? process.env.TEST_DB_DATABASE! : process.env.DB_DATABASE!,
    user: isTestEnvironment ? process.env.TEST_DB_USER! : process.env.DB_USER!,
    password: isTestEnvironment ? process.env.TEST_DB_PASSWORD! : process.env.DB_PASSWORD!,
  },
  redis: {
    mode: process.env.REDIS_MODE! || 'standalone',
    host: process.env.REDIS_HOST!,
    port: +process.env.REDIS_PORT!,
    password: process.env.REDIS_PASSWORD!,
    username: process.env.REDIS_USERNAME,
    tls: process.env.REDIS_TLS as 'yes' | 'no' | undefined,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY!,
    from: process.env.SENDGRID_EMAIL_FROM!,
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT!,
    accessKey: process.env.S3_ACCESS_KEY!,
    secretKey: process.env.S3_SECRET_KEY!,
    bucket: process.env.S3_BUCKET!,
    region: process.env.S3_REGION!,
  },
};

export const validateConfig = (options?: { exceptions?: string[] }) => {
  const missingKeys: string[] = [];
  Object.entries(config).forEach(([baseKey, baseValue]) => {
    Object.entries(baseValue).forEach(([key, value]) => {
      if ((value === '' || value === undefined) && !options?.exceptions?.includes(`${baseKey}.${key}`)) {
        missingKeys.push(`${baseKey}.${key}`);
      }
    });
  });
  if (missingKeys.length) {
    global.console.error(`The following configuration keys are not set: ${missingKeys.join(', ')}`);
    process.exit(1);
  }
};

validateConfig({
  exceptions: ['redis.username', 'redis.tls', 's3.endpoint'],
});

export default config;
