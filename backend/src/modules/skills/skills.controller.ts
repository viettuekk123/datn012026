import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SkillsService } from './skills.service';

@ApiTags('Skills')
@Controller('skills')
export class SkillsController {
  constructor(private skillsService: SkillsService) { }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách skills' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter theo category' })
  findAll(@Query('category') category?: string) {
    return this.skillsService.findAll(category);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lấy danh sách categories' })
  getCategories() {
    return {
      data: ['language', 'framework', 'database', 'devops', 'tool', 'other'],
    };
  }
}
