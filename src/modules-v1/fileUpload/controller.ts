import { Response } from 'express';
import { AuthenticatedRequest } from '../../types';
import { getUploadSignedUrl } from './services';
import { successResponse } from '../../lib/utils';

export default class FileController {
  static getUploadSignedUrl = async (req: AuthenticatedRequest, res: Response) => {
    const data = await getUploadSignedUrl(req.query as any);

    return res.send(
      successResponse({
        data,
      })
    );
  };
}
