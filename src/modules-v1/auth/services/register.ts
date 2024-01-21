/* eslint-disable no-await-in-loop */
import _ from 'lodash';

import config from '../../../config';
import * as utils from '../../../lib/utils';
import redis from '../../../database/redis';

import { wrapServiceAction } from '../../../lib/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';

import User from '../../../database/entities/User';
import UserRepo from '../../../database/repositories/UserRepo';
import { TokenFlag } from '../../../database/entities/enum';
import { RegisterRequest } from '../validators';
import mail from '../../../lib/mail';

export default wrapServiceAction({
  schema: RegisterRequest,
  handler: async (params: RegisterRequest) => {
    const existingUserWithEmail = await UserRepo.getUserByEmail(params.email);
    if (existingUserWithEmail) {
      throw new ServiceError(ErrorMessages.ITEM_EXISTS.replace('%k', 'a user with this email'));
    }

    const user = await UserRepo.createUser({
      ..._.omit(params, ['ipAddress', 'userAgent']),
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: await utils.bcryptHash(params.password),
    });

    const token = await utils.generateJWTToken({ userId: user.id, flag: TokenFlag.EMAIL_VERIFICATION });

    const code = config.env.isProduction ? utils.generateRandomCode(64) : '12345';

    const hash = await utils.bcryptHash(code);

    await redis.setex(`verification:email:${user.id}`, 30 * 60, hash);

    if (!config.env.isTest) {
      await mail.sendEmailVerificationLinkRequest(user.email, {
        link: `${config.app.frontendDomain}/auth/verify?token=${code}&email=${user.email}`,
      });
    }

    return {
      user: _.omit(user, User.sensitive),
      token,
    };
  },
});
