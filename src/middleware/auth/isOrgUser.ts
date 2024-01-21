import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import UserRepo from '../../database/repositories/UserRepo';
import { AuthenticationError, AuthorizationError, ErrorMessages } from '../../lib/errors';

export default async function isOrgUser(req: AuthenticatedRequest, response: Response, next: NextFunction) {
  const orgId = req.header('x-org-id');

  if (!orgId) throw new AuthenticationError(ErrorMessages.NOT_AUTHENTICATED);

  const user = await UserRepo.getUserByClause(
    {
      id: req.session.userId,
    },
    ['organizations']
  );

  if (!user) throw new AuthenticationError(ErrorMessages.NOT_AUTHENTICATED);

  const exists = user.organizations.find((org) => org.id === orgId);

  if (!exists) {
    throw new AuthorizationError(ErrorMessages.NOT_AUTHORIZED);
  }

  return next();
}
