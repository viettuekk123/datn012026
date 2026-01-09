import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async findById(id: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['jobs'],
    });
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }
    return company;
  }

  async findByUserId(userId: string): Promise<Company> {
    const company = await this.companiesRepository.findOne({
      where: { userId },
    });
    if (!company) {
      throw new NotFoundException('Công ty không tồn tại');
    }
    return company;
  }

  async update(userId: string, updateDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findByUserId(userId);
    Object.assign(company, updateDto);
    return this.companiesRepository.save(company);
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.companiesRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
