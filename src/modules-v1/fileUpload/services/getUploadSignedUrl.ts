import { GetUploadSignedUrlRequest } from '../validators';
import { genFileKey, getS3SignedUrl } from '../utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';
import { wrapServiceAction } from '../../../lib/utils';

export default wrapServiceAction({
  schema: GetUploadSignedUrlRequest,
  handler: async (params: GetUploadSignedUrlRequest) => {
    try {
      const keys = new Array(params.sign).fill(0).map(() => genFileKey());

      const data = await Promise.all(keys.map((key) => getS3SignedUrl(key)));

      return data;
    } catch (e) {
      throw new ServiceError(ErrorMessages.UNABLE_TO_GEN_SIGNED_URL);
    }
  },
});
