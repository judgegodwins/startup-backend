import { type NextFunction, type Request, type Response } from 'express';
import * as RequestIp from '@supercharge/request-ip';

export default (req: Request, res: Response, next: NextFunction): void => {
  try {
    res.locals.ip = RequestIp.getClientIp(req);
    res.locals.userAgent = req.get('User-Agent');
    next();
    return;
  } catch (error) {
    next(error);
  }
};
