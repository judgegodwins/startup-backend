import Redis from 'ioredis';
import config from '../config';

const { password, username, host, port, tls } = config.redis;

const extractedConfig = {
  password,
  username,
  tls:
    tls === 'yes'
      ? {
          requestCert: true,
          rejectUnauthorized: true,
        }
      : undefined,
};

const redis =
  config.redis.mode === 'cluster'
    ? new Redis.Cluster(
        [
          {
            port,
            host,
          },
        ],
        {
          redisOptions: {
            ...extractedConfig,
          },
        }
      )
    : new Redis({
        port: config.redis.port,
        host: config.redis.host,
        ...extractedConfig,
      });

export default redis;
