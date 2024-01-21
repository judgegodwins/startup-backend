/* eslint-disable max-classes-per-file */
import { IsInt, IsOptional, IsString, IsUUID, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { TransformToLowerCase, IsEmail as IsStrictEmail } from '.';

export class EmailRequest {
  @IsStrictEmail()
  @TransformToLowerCase()
  email: string;
}

export class EmailPasswordRequest {
  @IsStrictEmail()
  @TransformToLowerCase()
  email: string;

  @IsString()
  @MinLength(6, {
    message: 'Password should contain at least 6 characters',
  })
  password: string;
}

export class UserIdRequest {
  @IsUUID()
  userId: string;
}

export class LevelIdRequest {
  @IsUUID()
  levelId: string;
}

export class PaginationRequest {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Max(20)
  limit = 20;
}

export class LevelPaginationRequest extends PaginationRequest {
  @IsUUID()
  levelId: string;
}

export class StudentIdRequest {
  @IsUUID()
  studentId: string;
}

export class IdRequest {
  @IsUUID()
  id: string;
}

export class IdWithUserIdRequest extends UserIdRequest {
  @IsUUID()
  id: string;
}

export class SchoolSessionRequest {
  @IsUUID()
  sessionId: string;
}

export class OrganizationWithUserIdRequest extends UserIdRequest {
  @IsUUID()
  organizationId: string;
}

export class OrganizationRequest {
  @IsUUID()
  organizationId: string;
}

export class OrganizationWithIdRequest extends IdRequest {
  @IsUUID()
  organizationId: string;
}

export class EmptyRequest {}
