/* eslint-disable no-await-in-loop */
import { omit } from 'lodash';

import { wrapServiceAction } from '../../../lib/utils';
import { ErrorMessages, NotFoundError } from '../../../lib/errors';

import User from '../../../database/entities/User';
import UserRepo from '../../../database/repositories/UserRepo';
import { ProfileUpdateRequest } from '../validators';

export default wrapServiceAction({
  schema: ProfileUpdateRequest,
  handler: async (params: ProfileUpdateRequest) => {
    let user = await UserRepo.getUserById(params.userId);

    if (!user) {
      throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'user'));
    }

    user = await UserRepo.updateUserById(params.userId, {
      firstName: params.firstName,
      lastName: params.lastName,
    });

    return omit(user, User.sensitive);
  },
});
