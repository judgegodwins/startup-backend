/* eslint-disable max-classes-per-file */
import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { IsEmail, IsEmail as IsStrictEmail, TransformToLowerCase } from '../../../lib/validators';
import { EmailPasswordRequest, UserIdRequest } from '../../../lib/validators/global';
import { UserRole } from '../../../database/entities/enum';

export class RegisterRequest {
  @IsStrictEmail()
  @TransformToLowerCase()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @MinLength(6, {
    message: 'Password should contain at least 6 characters',
  })
  password: string;
}

export class ProfileRequest extends UserIdRequest {
  @IsEnum(UserRole)
  role: UserRole;
}

export class ProfileUpdateRequest extends UserIdRequest {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}

export class VerifyEmailRequest {
  @IsEmail()
  @TransformToLowerCase()
  email: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}

export class LoginRequest extends EmailPasswordRequest {}
