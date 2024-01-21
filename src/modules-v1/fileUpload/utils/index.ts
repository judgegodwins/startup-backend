import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import config from '../../../config';
import { generateRandomCode } from '../../../lib/utils';

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretKey,
  },
  region: config.s3.region,
  endpoint: config.s3.endpoint,
  forcePathStyle: true,
});

export async function getS3SignedUrl(key: string) {
  const command = new PutObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 300,
  });

  return {
    key,
    url,
  };
}

export async function getS3GetObjectSignedUrl(key: string) {
  const command = new GetObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });

  const url = await getSignedUrl(s3, command, {
    expiresIn: 1200,
  });

  return {
    key,
    url,
  };
}

export async function headObject(key: string) {
  const command = new HeadObjectCommand({
    Bucket: config.s3.bucket,
    Key: key,
  });

  const data = await s3.send(command);

  return data;
}

export function genFileKey() {
  return `${generateRandomCode(64)}-${new Date().toISOString().split('.')[0]}`;
}
