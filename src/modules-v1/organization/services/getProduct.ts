import { wrapServiceAction } from '../../../lib/utils';
import ProductRepo from '../../../database/repositories/ProductRepo';
import { IdRequest } from '../../../lib/validators/global';
import { getS3GetObjectSignedUrl } from '../../fileUpload/utils';
import { ErrorMessages, NotFoundError } from '../../../lib/errors';

export default wrapServiceAction({
  schema: IdRequest,
  handler: async (params: IdRequest) => {
    let product = await ProductRepo.getProductById(params.id);

    if (!product) throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'product'));
    product = {
      ...product,
      imageKeys: (await Promise.all(product.imageKeys.map((k) => getS3GetObjectSignedUrl(k)))).map((d) => d.url),
    };

    return product;
  },
});
