import { wrapServiceAction } from '../../../lib/utils';
import OrganizationRepo from '../../../database/repositories/OrganizationRepo';
import { SearchRequest } from '../validators';
import { getS3GetObjectSignedUrl } from '../../fileUpload/utils';

export default wrapServiceAction({
  schema: SearchRequest,
  handler: async (params: SearchRequest) => {
    let orgs = await OrganizationRepo.searchOrganizations(params.phrase);

    orgs = await Promise.all(
      orgs.map((org) =>
        (async () => {
          const o = {
            ...org,
            logo: org.logo ? (await getS3GetObjectSignedUrl(org.logo)).url : null,
          };

          return o;
        })()
      )
    );

    return orgs;
  },
});
