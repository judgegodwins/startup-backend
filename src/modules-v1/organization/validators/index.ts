/* eslint-disable max-classes-per-file */

import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';
import { OrganizationRequest, OrganizationWithIdRequest, UserIdRequest } from '../../../lib/validators/global';
import { OrganizationType, ProductType } from '../../../database/entities/enum';
import { IsEmail, IsPhoneNumber, TransformToLowerCase } from '../../../lib/validators';

export class CreateOrganizationRequest extends UserIdRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @Type(() => Date)
  yearFounded: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logo?: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @TransformToLowerCase()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsEnum(OrganizationType)
  @IsOptional()
  type?: OrganizationType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  industry?: string;
}

export class UpdateOrganizationRequest extends OrganizationRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  yearFounded: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  logo?: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @TransformToLowerCase()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @IsEnum(OrganizationType)
  @IsOptional()
  type?: OrganizationType;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  industry?: string;
}

export class CreateProductRequest extends OrganizationRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @IsString({ each: true })
  imageKeys: string[];

  @IsEnum(ProductType)
  type: ProductType;
}

export class UpdateProductRequest extends OrganizationWithIdRequest {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(255)
  name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsArray()
  @ArrayMaxSize(5)
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  imageKeys?: string[];

  @IsEnum(ProductType)
  @IsOptional()
  type?: ProductType;
}

export class SearchRequest {
  @IsString()
  @IsNotEmpty()
  phrase: string;
}
