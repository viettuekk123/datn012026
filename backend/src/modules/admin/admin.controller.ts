import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Lấy thống kê tổng quan' })
    getStats() {
        return this.adminService.getStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Lấy danh sách users' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'role', required: false, enum: ['admin', 'employer', 'candidate'] })
    @ApiQuery({ name: 'isActive', required: false, type: Boolean })
    getUsers(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
        @Query('role') role?: string,
        @Query('isActive') isActive?: string,
    ) {
        const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.adminService.getUsers(+page, +limit, role, isActiveBoolean);
    }

    @Put('users/:id')
    @ApiOperation({ summary: 'Cập nhật trạng thái user (block/unblock)' })
    updateUser(
        @Param('id') id: string,
        @Body() body: { isActive: boolean },
    ) {
        return this.adminService.updateUser(id, body.isActive);
    }
}
