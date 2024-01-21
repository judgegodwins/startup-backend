import { isEmpty, isNil, omit, omitBy } from 'lodash';
import { NotFound } from '@aws-sdk/client-s3';
import { UpdateOrganizationRequest } from '../validators';
import { wrapServiceAction } from '../../../lib/utils';
import OrganizationRepo from '../../../database/repositories/OrganizationRepo';
import { getS3GetObjectSignedUrl, headObject } from '../../fileUpload/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';

export default wrapServiceAction({
  schema: UpdateOrganizationRequest,
  handler: async (params: UpdateOrganizationRequest) => {
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

    const org = await OrganizationRepo.updateOrganizationById(params.organizationId, {
      ...omitBy(omit(params, ['organizationId']), isEmpty),
    });

    if (org?.logo) org.logo = (await getS3GetObjectSignedUrl(org.logo)).url;

    return org;
  },
});
