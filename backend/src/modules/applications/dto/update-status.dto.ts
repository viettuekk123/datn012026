import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({ enum: ['accepted', 'rejected'] })
  @IsEnum(['accepted', 'rejected'])
  status: string;

  @ApiPropertyOptional({ example: 'Ghi chú...' })
  @IsString()
  @IsOptional()
  note?: string;
}
