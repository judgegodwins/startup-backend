import { omit } from 'lodash';
import { NotFound } from '@aws-sdk/client-s3';
import { CreateOrganizationRequest } from '../validators';
import { wrapServiceAction } from '../../../lib/utils';
import OrganizationRepo from '../../../database/repositories/OrganizationRepo';
import User from '../../../database/entities/User';
import { headObject } from '../../fileUpload/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';

export default wrapServiceAction({
  schema: CreateOrganizationRequest,
  handler: async (params: CreateOrganizationRequest) => {
    if (params.logo) {
      try {
        await headObject(params.logo);
      } catch (e) {
        if (e instanceof NotFound) {
          throw new ServiceError(ErrorMessages.INVALID_S3_KEY);
        }
        throw e;
      }
    }

    const org = await OrganizationRepo.createOrganization({
      ...omit(params, ['userId']),
      users: [{ id: params.userId } as User],
    });

    return org;
  },
});
