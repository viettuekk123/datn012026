import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CvService } from './cv.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('CV')
@Controller('cv')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvController {
  constructor(private cvService: CvService) { }

  @Post('upload')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOperation({ summary: 'Upload và parse CV' })
  upload(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('--- Upload Debug ---');
    console.log('User ID:', req.user?.userId);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('File received:', file ? file.originalname : 'UNDEFINED');

    if (!file) {
      throw new BadRequestException('File không tìm thấy trong yêu cầu (Multipart key must be "file")');
    }

    return this.cvService.upload(req.user.userId, file);
  }

  @Get('my')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Lấy danh sách CV của tôi' })
  findMyCvs(@Request() req) {
    return this.cvService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết CV' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.cvService.findById(id, req.user.userId);
  }

  @Put(':id/default')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Đặt CV làm mặc định' })
  setDefault(@Request() req, @Param('id') id: string) {
    return this.cvService.setDefault(req.user.userId, id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CANDIDATE)
  @ApiOperation({ summary: 'Xóa CV' })
  delete(@Request() req, @Param('id') id: string) {
    return this.cvService.delete(req.user.userId, id);
  }
}
