import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { successResponse } from '../../lib/utils';
import createOrganization from './services/createOrganization';
import getOrganization from './services/getOrganization';
import createProduct from './services/createProduct';
import getProducts from './services/getProducts';
import getOrganizationPublic from './services/getOrganizationPublic';
import searchOrganizations from './services/searchOrganizations';
import getProduct from './services/getProduct';
import updateOrganization from './services/updateOrganization';
import updateProduct from './services/updateProduct';

export default class OrganizationController {
  static createOrganization = async (req: AuthenticatedRequest, res: Response) => {
    const data = await createOrganization({
      ...req.body,
      userId: req.session.userId,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static getOrganization = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getOrganization({
      id: req.params.id,
      userId: req.session.userId,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static getOrganizationPublic = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getOrganizationPublic({
      id: req.params.id,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static updateOrganization = async (req: AuthenticatedRequest, res: Response) => {
    const data = await updateOrganization({
      ...req.body,
      organizationId: req.header('x-org-id') as any,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static searchOrganizations = async (req: AuthenticatedRequest, res: Response) => {
    const data = await searchOrganizations({
      phrase: req.query.phrase as string,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static createProduct = async (req: AuthenticatedRequest, res: Response) => {
    const data = await createProduct({
      ...req.body,
      organizationId: req.header('x-org-id') as any,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static getProducts = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getProducts({
      organizationId: req.header('x-org-id') as any,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    const data = await updateProduct({
      ...req.body,
      id: req.params.id,
      organizationId: req.header('x-org-id') as any,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static getProductsPublic = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getProducts({
      organizationId: req.params.id,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };

  static getProduct = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getProduct({
      id: req.params.id,
    });

    return res.send(
      successResponse({
        data,
      })
    );
  };
}
