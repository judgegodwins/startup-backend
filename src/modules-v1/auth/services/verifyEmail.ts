/* eslint-disable no-await-in-loop */
import { omit } from 'lodash';

import redis from '../../../database/redis';

import { wrapServiceAction } from '../../../lib/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';

import User from '../../../database/entities/User';
import UserRepo from '../../../database/repositories/UserRepo';
import { VerifyEmailRequest } from '../validators';
import { createSession } from '../../../lib/utils/auth';

export default wrapServiceAction({
  schema: VerifyEmailRequest,
  handler: async (params: VerifyEmailRequest) => {
    const user = await UserRepo.getUserByEmail(params.email);
    if (!user) {
      throw new ServiceError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'user'));
    }

    const verificationKey = `verification:email:${user.id}`;
    const existingToken = await redis.get(verificationKey);

    if (!existingToken) {
      throw new ServiceError(ErrorMessages.EMAIL_VERIFICATION_LINK_EXPIRED);
    }

    await Promise.all([
      UserRepo.updateUserById(user.id, {
        emailVerifiedAt: new Date(),
      }),
      redis.del(verificationKey),
    ]);

    const { token, expires } = await createSession(user);

    return {
      user: omit(user, User.sensitive),
      token,
      tokenExpiresOn: new Date(expires).toISOString(),
    };
  },
});
