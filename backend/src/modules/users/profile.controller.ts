import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Profile')
@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.CANDIDATE)
@ApiBearerAuth()
export class ProfileController {
    constructor(private usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Lấy profile của tôi' })
    getMyProfile(@Request() req) {
        return this.usersService.getProfile(req.user.userId);
    }

    @Put('me')
    @ApiOperation({ summary: 'Cập nhật profile của tôi' })
    updateMyProfile(@Request() req, @Body() updateDto: UpdateProfileDto) {
        return this.usersService.updateProfile(req.user.userId, updateDto);
    }
}
