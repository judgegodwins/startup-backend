import { NotFound } from '@aws-sdk/client-s3';
import { CreateProductRequest } from '../validators';
import { wrapServiceAction } from '../../../lib/utils';
import { headObject } from '../../fileUpload/utils';
import { ErrorMessages, ServiceError } from '../../../lib/errors';
import ProductRepo from '../../../database/repositories/ProductRepo';

export async function checkObjectExists(key: string) {
  try {
    await headObject(key);
  } catch (e) {
    if (e instanceof NotFound) {
      throw new ServiceError(ErrorMessages.INVALID_S3_KEY);
    }
    throw e;
  }
}

export function T() {}
