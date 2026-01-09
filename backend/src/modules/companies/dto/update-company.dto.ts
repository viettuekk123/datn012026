import { IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'FPT Software' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Công ty phần mềm hàng đầu Việt Nam' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '1000+' })
  @IsString()
  @IsOptional()
  companySize?: string;

  @ApiPropertyOptional({ example: 'Hà Nội, TP.HCM' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'https://fpt-software.com' })
  @IsUrl()
  @IsOptional()
  website?: string;
}
