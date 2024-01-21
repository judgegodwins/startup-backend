import { Router } from 'express';
import OrganizationController from './controller';
import isAuthenticatedUser from '../../middleware/auth/isAuthenticatedUser';
import isOrgUser from '../../middleware/auth/isOrgUser';

const router = Router();

router.post('/', isAuthenticatedUser(), OrganizationController.createOrganization);
router.patch('/', isAuthenticatedUser(), isOrgUser, OrganizationController.updateOrganization);

router.get('/details/:id', isAuthenticatedUser(), OrganizationController.getOrganization);
router.get('/public/:id', OrganizationController.getOrganizationPublic);

router.get('/search', OrganizationController.searchOrganizations);

router
  .route('/products')
  .post(isAuthenticatedUser(), isOrgUser, OrganizationController.createProduct)
  .get(isAuthenticatedUser(), isOrgUser, OrganizationController.getProducts);

router
  .route('/products/:id')
  .get(OrganizationController.getProduct)
  .patch(isAuthenticatedUser(), isOrgUser, OrganizationController.updateProduct);

router.get('/:id/products', OrganizationController.getProductsPublic);

export default router;
