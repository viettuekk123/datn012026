import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách jobs (public)' })
  findAll(@Query() filterDto: JobFilterDto) {
    return this.jobsService.findAll(filterDto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách jobs của công ty tôi' })
  findMyJobs(@Request() req, @Query('page') page = 1, @Query('limit') limit = 10) {
    return this.jobsService.findByCompany(req.user.userId, +page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết job' })
  findOne(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo job mới' })
  create(@Request() req, @Body() createDto: CreateJobDto) {
    return this.jobsService.create(req.user.userId, createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật job' })
  update(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateJobDto) {
    return this.jobsService.update(req.user.userId, id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa job' })
  delete(@Request() req, @Param('id') id: string) {
    return this.jobsService.delete(req.user.userId, id);
  }
}
