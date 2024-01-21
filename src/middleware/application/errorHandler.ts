import { type Request, type Response, type NextFunction } from 'express';
import {
  type GenericError,
  ServiceError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
} from '../../lib/errors';
import { errorLogger } from '../../lib/logger';
import config, { AppEnvironmentEnum } from '../../config';

const logError = (err: any, req: Request) => {
  errorLogger.error(err.message, {
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    stack: err.stack,
  });
};

export default (err: GenericError, req: Request, res: Response, next: NextFunction): void | Response => {
  if (res.headersSent) {
    next(err);
    return {} as Response;
  }
  switch (err.name) {
    case ServiceError.name:
    case NotFoundError.name:
    case AuthenticationError.name:
    case AuthorizationError.name:
      if (config.env.isTest) logError(err, req);
      return res.status(err.statusCode).send({
        status: 'error',
        message: err.message,
      });
    case ValidationError.name:
      if (config.env.isTest) logError(err, req);
      return res.status(err.statusCode).send({
        status: 'error',
        message: err.message,
        errors: (err as ValidationError).errors,
      });
    case SyntaxError.name: // for json parser
      return res.status(err.statusCode).send({
        status: 'error',
        message: 'invalid json body',
      });
    default:
      logError(err, req);
      return res.status(500).send({
        status: 'error',
        message: 'an error occurred',
        ...([AppEnvironmentEnum.LOCAL, AppEnvironmentEnum.DEVELOPMENT].includes(config.app.env)
          ? { stack: err.stack }
          : {}),
      });
  }
};
