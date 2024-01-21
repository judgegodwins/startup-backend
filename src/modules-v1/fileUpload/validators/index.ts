import { Type } from 'class-transformer';
import { IsMimeType, IsNumber, IsOptional } from 'class-validator';

// eslint-disable-next-line import/prefer-default-export
export class GetUploadSignedUrlRequest {
  @IsMimeType()
  @IsOptional()
  contentType?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  sign = 1;
}
