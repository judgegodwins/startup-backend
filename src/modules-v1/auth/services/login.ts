import _ from 'lodash';
import { LoginRequest } from '../validators';
import { bcryptCompare, wrapServiceAction } from '../../../lib/utils';
import UserRepo from '../../../database/repositories/UserRepo';
import { ErrorMessages, ServiceError } from '../../../lib/errors';
import { createSession } from '../../../lib/utils/auth';
import User from '../../../database/entities/User';

export default wrapServiceAction({
  schema: LoginRequest,
  handler: async (params: LoginRequest) => {
    const user = await UserRepo.getUserByEmail(params.email);

    if (!user) {
      throw new ServiceError(ErrorMessages.LOGIN_CREDENTIALS_INVALID);
    }

    const passwordsMatch = await bcryptCompare(params.password, user.password);

    if (!passwordsMatch) {
      throw new ServiceError(ErrorMessages.LOGIN_CREDENTIALS_INVALID);
    }

    const { token, expires } = await createSession(user);

    return {
      user: _.omit(user, User.sensitive),
      token,
      tokenExpiresOn: new Date(expires).toISOString(),
    };
  },
});
