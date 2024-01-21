import { wrapServiceAction } from '../../../lib/utils';
import ProductRepo from '../../../database/repositories/ProductRepo';
import { OrganizationRequest } from '../../../lib/validators/global';
import { getS3GetObjectSignedUrl } from '../../fileUpload/utils';
import Product from '../../../database/entities/Product';

async function t(p: Product) {
  const data = await Promise.all(p.imageKeys.map((k) => getS3GetObjectSignedUrl(k)));

  return {
    ...p,
    imageKeys: data.map((d) => d.url),
  };
}

export default wrapServiceAction({
  schema: OrganizationRequest,
  handler: async (params: OrganizationRequest) => {
    let products = await ProductRepo.getProductsByClause({
      organizationId: params.organizationId,
    });

    products = await Promise.all(products.map((p) => t(p)));
    return products;
  },
});
