import { chunk } from 'lodash';
import { NotFoundError, ServiceError } from '../errors';
import { ErrorMessages } from '../errors/messages';

export interface IEnsure<T, R> {
  data: T;
  handler: (wrapped: T) => Promise<R>;
  customError?: (data: T) => void;
  customMessage?: string;
  tag?: string;
}

export interface IEnsureArray<T, R> {
  data: T[];
  handler: (wrapped: T) => Promise<R>;
  tag?: string;
  customMessage?: string;
  customError?: (data?: T) => void;
}

export default class Maybe {
  static ensure = async <T, R>({ data, handler, tag, customError, customMessage }: IEnsure<T, R>) => {
    const response = await handler(data);
    if (!response) {
      if (customError) {
        customError(data);
      } else {
        throw new NotFoundError(
          customMessage || ErrorMessages.ITEM_NOT_FOUND.replace('%k', tag || 'resource').replace('%d', String(data))
        );
      }
    }
    return response as NonNullable<Awaited<R>>;
  };

  static ensureAll = async <T, R>({ data, handler, tag, customError, customMessage }: IEnsureArray<T, R>) => {
    const chunks = chunk(data, 5);
    const promisedChunks = chunks.map((c) =>
      Promise.all(c.map((d) => Maybe.ensure({ data: d, handler, tag, customError, customMessage })))
    );

    return (await Promise.all(promisedChunks)).flat();
  };

  static ensureAllNot = async <T, R>({ data, handler, tag, customError, customMessage }: IEnsureArray<T, R>) => {
    const chunks = chunk(data, 5);
    const promisedChunks = chunks.map((c) =>
      Promise.all(c.map((d) => Maybe.ensureNot({ data: d, handler, tag, customError, customMessage })))
    );

    return (await Promise.all(promisedChunks)).flat();
  };

  static ensureNot = async <T, R>({ data, handler, tag, customError, customMessage }: IEnsure<T, R>) => {
    const response = await handler(data);
    if (response) {
      if (customError) {
        customError(data);
      } else {
        throw new ServiceError(customMessage || ErrorMessages.ITEM_EXISTS.replace('%k', tag || 'resource'));
      }
    }
  };
}
