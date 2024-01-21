import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EntityManager, getManager } from 'typeorm';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError as CValidationError, ValidatorOptions } from 'class-validator';
import { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

import { ErrorObject, ValidationError } from '../errors';

export const getAllConstraints = (errors: CValidationError[]): Record<string, string>[] => {
  const constraints = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const error of errors) {
    if (error.constraints) {
      constraints.push(error.constraints);
    }
    if (error.children) {
      constraints.push(...getAllConstraints(error.children));
    }
  }

  return constraints;
};

export const getErrorObject = (errors: CValidationError[], prefix?: string) => {
  let obj: ErrorObject = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const error of errors) {
    const key = `${prefix ? `${prefix}.` : ''}${error.property}`;
    obj[key] = error.constraints ? Object.values(error.constraints) : [];
    if (error.children) {
      obj = {
        ...obj,
        ...getErrorObject(error.children, key),
      };
    }
  }

  return obj;
};

export async function transformAndValidate<T, V>(params: {
  schema: ClassConstructor<T>;
  body: V;
  options?: ValidatorOptions;
}): Promise<ErrorObject | null> {
  const options = params.options || {};

  const transformed = <Record<string, never>>plainToInstance<T, V>(params.schema, params.body);

  const errors = await validate(transformed, {
    whitelist: true,
    forbidNonWhitelisted: true,
    validationError: { target: false },
    ...options,
  });

  if (errors.length > 0) {
    const cErrors = getErrorObject(errors);
    return cErrors;
  }

  return null;
}

export function wrapServiceAction<T, V extends (args: any) => any>(params: {
  schema: ClassConstructor<T>;
  handler: V;
}): (...funcArgs: Parameters<V>) => Promise<ReturnType<V>> {
  return async (...args: Parameters<V>): Promise<ReturnType<V>> => {
    const transformed = <Record<string, never>>plainToInstance<T, unknown>(params.schema, args[0]);
    const errors = await validate(transformed, {
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
    });
    if (errors.length > 0) {
      const cErrors = getErrorObject(errors);
      throw new ValidationError(cErrors);
    }
    return params.handler(transformed);
  };
}

export function successResponse(result: { message?: string; data: any }) {
  return {
    status: 'success',
    ...result,
    message: result.message || 'success',
  };
}

export function generateRandomCode(length: number) {
  return crypto
    .randomBytes(length * 3)
    .toString('base64')
    .split('+')
    .join('')
    .split('/')
    .join('')
    .split('=')
    .join('')
    .substr(0, length);
}

export function generateHash(seed: string) {
  const data = seed.toString() + Date.now().toString();
  return crypto.createHash('sha256').update(data).digest('hex');
}

export function bcryptHash(password: string) {
  return bcrypt.hash(password, config.app.bcryptRounds);
}

export function bcryptCompare(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function generateJWTToken(
  payload: Record<string, any>,
  secret: string = config.app.secret,
  expiresIn?: string
): Promise<string> {
  const jwtPayload = {
    ...payload,
    counter: generateRandomCode(36),
  };
  const options = { expiresIn: expiresIn || '720h' };

  return new Promise((resolve, reject) => {
    jwt.sign(jwtPayload, secret, options, (err: any, token: string | undefined) => {
      if (err) {
        reject(err);
      }
      resolve(token as string);
    });
  });
}

export async function decodeToken(token: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.app.secret, (err: any, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });
}

interface Action<T> {
  (entityMngr: EntityManager): Promise<TransactionResult<T>>;
}

interface TransactionResult<T = any> {
  success: boolean;
  data: T;
}

/**
 * Utility for running db queries in transactions. Ensure you pass the EntityManager (qr) to all repo actions
 * to run them in the transaction. If you don't it could lead to unpredictable results
 * @param action
 * @param tries Number of re-tries if errors occur
 */
export async function transaction<T>(action: Action<T>, tries = 2): Promise<T> {
  let currentTry = 0;

  let result: TransactionResult = { success: false, data: null };
  while (!result.success) {
    currentTry += 1;
    try {
      // eslint-disable-next-line no-await-in-loop
      result = await getManager().transaction(action);
    } catch (e) {
      if (currentTry >= tries) throw e;
    }
  }

  return result.data;
}

export function calcSkip({ page, limit }: { page: number; limit: number }) {
  return (page - 1) * limit;
}

export function paginateResponse(data: [any[], number], page: number, take: number) {
  const [result, total] = data;
  const lastPage = Math.ceil(total / take) || +page;
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;

  // console.log(lastPage, nextPage, page + 1 > lastPage, page);
  return {
    data: [...result],
    pageData: {
      total,
      currentPage: +page,
      nextPage,
      prevPage,
      lastPage,
    },
  };
}
