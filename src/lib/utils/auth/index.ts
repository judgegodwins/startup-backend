import moment from 'moment';

import * as utils from '../index';
import redis from '../../../database/redis';

import User from '../../../database/entities/User';
import { TokenFlag } from '../../../database/entities/enum';

// eslint-disable-next-line import/prefer-default-export
export const createSession = async (user: User) => {
  const token = await utils.generateJWTToken({ userId: user.id, flag: TokenFlag.AUTH });
  const decodedToken = await utils.decodeToken(token);

  const sessionKeyPrefix = `sessions:${user.id}`;
  const sessionKey = `${sessionKeyPrefix}:${decodedToken.counter as string}`;
  const expires = moment().diff(moment(decodedToken.exp), 'seconds');

  await redis.setex(sessionKey, expires, token);
  await redis.sadd(sessionKeyPrefix, sessionKey);
  await redis.expire(sessionKeyPrefix, expires);

  return { token, expires: decodedToken.exp! * 1000 };
};
