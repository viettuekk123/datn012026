import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional({ example: 'Nguyễn Văn A' })
    @IsOptional()
    @IsString()
    fullName?: string;

    @ApiPropertyOptional({ example: '0912345678' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ example: 'TP.HCM' })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional({ example: 'Backend Developer' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    experienceYears?: number;

    @ApiPropertyOptional({ example: 25000000 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    expectedSalary?: number;

    @ApiPropertyOptional({ example: 'hybrid', enum: ['onsite', 'remote', 'hybrid'] })
    @IsOptional()
    @IsString()
    @IsIn(['onsite', 'remote', 'hybrid'])
    workType?: string;

    @ApiPropertyOptional({ example: 'Tôi là một developer với 3 năm kinh nghiệm...' })
    @IsOptional()
    @IsString()
    bio?: string;
}
