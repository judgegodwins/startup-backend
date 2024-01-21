import { wrapServiceAction } from '../../../lib/utils';
import UserRepo from '../../../database/repositories/UserRepo';
import { ErrorMessages, NotFoundError } from '../../../lib/errors';
import { UserIdRequest } from '../../../lib/validators/global';

export default wrapServiceAction({
  schema: UserIdRequest,
  handler: async (params: UserIdRequest) => {
    const user = await UserRepo.getUserByClause(
      {
        id: params.userId,
      },
      ['organizations']
    );

    if (!user) throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'user'));

    return user.organizations;
  },
});
