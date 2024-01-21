import { NotFound } from '@aws-sdk/client-s3';
import { CreateProductRequest, UpdateProductRequest } from '../validators';
import { wrapServiceAction } from '../../../lib/utils';
import { getS3GetObjectSignedUrl, headObject } from '../../fileUpload/utils';
import { ErrorMessages, NotFoundError, ServiceError } from '../../../lib/errors';
import ProductRepo from '../../../database/repositories/ProductRepo';
import { checkObjectExists } from '../utils';

export default wrapServiceAction({
  schema: UpdateProductRequest,
  handler: async (params: UpdateProductRequest) => {
    if (params.imageKeys) {
      await Promise.all(params.imageKeys.map((key) => checkObjectExists(key)));
    }

    let product = await ProductRepo.getProductByClause({
      id: params.id,
      organizationId: params.organizationId,
    });

    if (!product) {
      throw new NotFoundError(ErrorMessages.ITEM_NOT_FOUND.replace('%k', 'product'));
    }

    product = await ProductRepo.updateProductById(params.id, params);

    if (product) {
      product = {
        ...product,
        imageKeys: (await Promise.all(product.imageKeys.map((k) => getS3GetObjectSignedUrl(k)))).map((k) => k.url),
      };
    }
    return product;
  },
});
