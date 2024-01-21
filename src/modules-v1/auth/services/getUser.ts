import { omit } from 'lodash';
import { wrapServiceAction } from '../../../lib/utils';
import UserRepo from '../../../database/repositories/UserRepo';
import { ErrorMessages, NotFoundError } from '../../../lib/errors';
import { UserIdRequest } from '../../../lib/validators/global';
import User from '../../../database/entities/User';

export default wrapServiceAction({
  schema: UserIdRequest,
  handler: async (params: UserIdRequest) => {
    const user = await UserRepo.getUserById(params.userId);

    if (!user) throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'user'));

    return { user: omit(user, User.sensitive) };
  },
});
