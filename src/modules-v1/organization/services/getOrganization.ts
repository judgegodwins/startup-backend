import { omit } from 'lodash';
import { wrapServiceAction } from '../../../lib/utils';
import OrganizationRepo from '../../../database/repositories/OrganizationRepo';
import { AuthorizationError, ErrorMessages, NotFoundError } from '../../../lib/errors';
import { IdWithUserIdRequest } from '../../../lib/validators/global';
import { getS3GetObjectSignedUrl } from '../../fileUpload/utils';

export default wrapServiceAction({
  schema: IdWithUserIdRequest,
  handler: async (params: IdWithUserIdRequest) => {
    const org = await OrganizationRepo.getOrganizationByClause(
      {
        id: params.id,
      },
      ['users']
    );

    if (!org) throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'organization'));
    const found = org?.users.find((u) => u.id === params.userId);

    if (!found) {
      throw new AuthorizationError(ErrorMessages.NOT_AUTHORIZED);
    }

    if (org.logo) org.logo = (await getS3GetObjectSignedUrl(org.logo)).url;

    return omit(org, ['users']);
  },
});
