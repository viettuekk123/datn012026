import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty({ example: 'Senior Backend Developer' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'senior' })
  @IsString()
  @IsOptional()
  level?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  experienceMin?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsNumber()
  @IsOptional()
  experienceMax?: number;

  @ApiPropertyOptional({ example: 25000000 })
  @IsNumber()
  @IsOptional()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 40000000 })
  @IsNumber()
  @IsOptional()
  salaryMax?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  salaryVisible?: boolean;

  @ApiPropertyOptional({ example: 'TP.HCM' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'hybrid' })
  @IsString()
  @IsOptional()
  workType?: string;

  @ApiPropertyOptional({ example: 'Mô tả công việc...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Yêu cầu ứng viên...' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiPropertyOptional({ example: 'Quyền lợi...' })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiPropertyOptional({ example: [1, 2, 5] })
  @IsArray()
  @IsOptional()
  skillIds?: number[];

  @ApiPropertyOptional({ example: '2025-02-28' })
  @IsDateString()
  @IsOptional()
  deadline?: string;
}
