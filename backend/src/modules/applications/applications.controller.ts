import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApplicationFilterDto } from './dto/application-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Nộp đơn ứng tuyển' })
  create(@Request() req, @Body() createDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.userId, createDto);
  }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Lấy danh sách đơn của tôi' })
  findMyApplications(@Request() req) {
    return this.applicationsService.findByCandidate(req.user.userId);
  }

  @Get('job/:jobId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Lấy danh sách ứng viên của job' })
  findByJob(@Request() req, @Param('jobId') jobId: string, @Query() filterDto: ApplicationFilterDto) {
    return this.applicationsService.findByJob(req.user.userId, jobId, filterDto);
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(UserRole.EMPLOYER)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn' })
  updateStatus(@Request() req, @Param('id') id: string, @Body() updateDto: UpdateStatusDto) {
    return this.applicationsService.updateStatus(req.user.userId, id, updateDto);
  }
}
