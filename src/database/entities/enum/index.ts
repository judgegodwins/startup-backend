export enum UserStatusEnum {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
}

export enum EnterpriseRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

export enum TokenFlag {
  AUTH = 'auth',
  EMAIL_VERIFICATION = 'email_verification',
}

export enum UserRole {
  USER = 'user',
}

export enum CourseType {
  COMPULSORY = 'compulsory',
  ELECTIVE = 'elective',
}

export enum SpreadsheetFields {
  MATNO = 'matriculation_number',
  CA = 'ca',
  EXAM = 'exam',
  TOTAL = 'total',
  GRADE = 'grade',
}

export enum ResultGrade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export const resultSheetName = 'Results';

export enum ProductType {
  PRODUCT = 'product',
  SERVICE = 'service',
}

export enum OrganizationType {
  PROFIT = 'for-profit',
  NONPROFIT = 'non-profit',
}
