import { wrapServiceAction } from '../../../lib/utils';
import OrganizationRepo from '../../../database/repositories/OrganizationRepo';
import { ErrorMessages, NotFoundError } from '../../../lib/errors';
import { IdRequest } from '../../../lib/validators/global';
import { getS3GetObjectSignedUrl } from '../../fileUpload/utils';

export default wrapServiceAction({
  schema: IdRequest,
  handler: async (params: IdRequest) => {
    const org = await OrganizationRepo.getOrganizationById(params.id);

    if (!org) throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'organization'));

    if (org.logo) org.logo = (await getS3GetObjectSignedUrl(org.logo)).url;

    return org;
  },
});
