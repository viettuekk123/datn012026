import { IsOptional, IsString, IsNumber, IsArray, IsEnum } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplicationFilterDto {
  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ type: [String] })
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  matchMin?: number;

  @ApiPropertyOptional({ enum: ['pending', 'accepted', 'rejected'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ enum: ['match_desc', 'newest'] })
  @IsString()
  @IsOptional()
  sort?: string;
}
