import { omit } from 'lodash';
import { Request, Response } from 'express';
import { successResponse } from '../../lib/utils';
import login from './services/login';
import { AuthenticatedRequest } from '../../types';
import User from '../../database/entities/User';
import register from './services/register';
import verifyEmail from './services/verifyEmail';
import updateProfile from './services/updateProfile';
import getUserOrganizations from './services/getUserOrganizations';

export default class AuthController {
  public static login = async (req: Request, res: Response) => {
    const result = await login(req.body);

    return res.send(
      successResponse({
        data: result,
      })
    );
  };

  public static register = async (req: Request, res: Response) => {
    const result = await register(req.body);

    return res.send(
      successResponse({
        data: result,
      })
    );
  };

  public static verifyEmail = async (req: Request, res: Response) => {
    const result = await verifyEmail(req.body);

    return res.send(
      successResponse({
        data: result,
      })
    );
  };

  public static updateProfile = async (req: AuthenticatedRequest, res: Response) => {
    const result = await updateProfile({
      ...omit(req.body, ['userId']),
      userId: req.session.userId,
    });

    return res.send(
      successResponse({
        data: result,
      })
    );
  };

  // public static getProfile = async (req: AuthenticatedRequest, res: Response) => {
  //   const result = await getProfile({
  //     userId: req.session.userId,
  //     role: req.session.userRole,
  //   });

  //   return res.send(
  //     successResponse({
  //       data: result,
  //     })
  //   );
  // };

  public static getUser = async (req: AuthenticatedRequest, res: Response) => {
    return res.send(
      successResponse({
        data: omit(req.session.user, User.sensitive),
      })
    );
  };

  public static getUserOrganizations = async (req: AuthenticatedRequest, res: Response) => {
    const result = await getUserOrganizations({
      userId: req.session.userId,
    });

    return res.send(
      successResponse({
        data: result,
      })
    );
  };
}
