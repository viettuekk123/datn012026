import { Controller, Get, Put, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách công ty' })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.companiesService.findAll(+page, +limit);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin công ty của tôi' })
  getMyCompany(@Request() req) {
    return this.companiesService.findByUserId(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin công ty theo ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findById(id);
  }

  @Put('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin công ty' })
  update(@Request() req, @Body() updateDto: UpdateCompanyDto) {
    return this.companiesService.update(req.user.userId, updateDto);
  }
}
