import { NotFound } from '@aws-sdk/client-s3';
import { CreateProductRequest } from '../validators';
import { wrapServiceAction } from '../../../lib/utils';
import { headObject } from '../../fileUpload/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';
import ProductRepo from '../../../database/repositories/ProductRepo';
import { checkObjectExists } from '../utils';

export default wrapServiceAction({
  schema: CreateProductRequest,
  handler: async (params: CreateProductRequest) => {
    await Promise.all(params.imageKeys.map((key) => checkObjectExists(key)));

    const product = await ProductRepo.createProduct(params);

    return product;
  },
});
