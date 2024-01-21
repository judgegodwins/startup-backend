import { type Response, type NextFunction } from 'express';
import { omit } from 'lodash';

import { AuthenticationError } from '../../lib/errors';
import * as utils from '../../lib/utils';
import { type AuthenticatedRequest } from '../../types';
import UserRepo from '../../database/repositories/UserRepo';
import redis from '../../database/redis';
import { TokenFlag } from '../../database/entities/enum';

export default (tokenFlag = TokenFlag.AUTH) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authorization = req.header('authorization') || '';
      const token = authorization.split(' ')[1];
      if (!token) {
        next(new AuthenticationError('you need to be authenticated to access this endpoint'));
        return;
      }

      const { userId, flag, counter } = await utils.decodeToken(token);

      if (!userId) {
        next(new AuthenticationError('unable to verify token'));
        return;
      }

      if (flag !== tokenFlag) {
        next(new AuthenticationError(`token is not valid for ${tokenFlag}`));
        return;
      }

      const user = await UserRepo.getUserById(userId);
      const session = await redis.get(`sessions:${userId as string}:${counter as string}`);
      if (user == null || (tokenFlag === TokenFlag.AUTH && !session)) {
        next(new AuthenticationError('token is invalid'));
        return;
      }

      req.session = {
        userId: user.id,
        userRole: user.role,
        user: omit(user, ['password']),
      };

      next();
      return;
    } catch (e: any) {
      switch (e.name) {
        case 'TokenExpiredError': {
          next(new AuthenticationError('token has expired'));
          return;
        }
        case 'JsonWebTokenError': {
          next(new AuthenticationError(e.message));
          return;
        }
        case 'NotBeforeError': {
          next(new AuthenticationError(e.message));
          return;
        }
        default: {
          next(e);
        }
      }
    }
  };
