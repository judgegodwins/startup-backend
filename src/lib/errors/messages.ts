// eslint-disable-next-line import/prefer-default-export
export enum ErrorMessages {
  LOGIN_CREDENTIALS_INVALID = 'email or password is not correct',
  CONTACT_SUPPORT = 'contact support',
  ITEM_NOT_FOUND = '%k not found',
  ITEM_EXISTS = '%k already exists',
  NOT_AUTHENTICATED = 'not authenticated',
  NOT_AUTHORIZED = 'not authorized',
  CANT_REGISTER_COURSE = 'you cannot register for this course',
  CANT_GET_STUDENT_LEVEL = "cannot determine student's level",
  NO_CURRENT_SESSION = 'current session not set. please set current session',
  INVALID_FORMAT_CONTENT = 'invalid file format or content',
  EMAIL_VERIFICATION_LINK_EXPIRED = 'email verification link expired',
  UNABLE_TO_GEN_SIGNED_URL = 'unable to generate signed url',
  INVALID_S3_KEY = 'invalid s3 key',
}
