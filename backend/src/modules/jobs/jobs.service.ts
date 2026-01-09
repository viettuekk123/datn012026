import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../../entities/job.entity';
import { Company } from '../../entities/company.entity';
import { SkillsService } from '../skills/skills.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private skillsService: SkillsService,
  ) { }

  async create(userId: string, createDto: CreateJobDto): Promise<Job> {
    const company = await this.companiesRepository.findOne({ where: { userId } });
    if (!company) {
      throw new ForbiddenException('Bạn chưa có công ty');
    }

    const job = this.jobsRepository.create({
      ...createDto,
      companyId: company.id,
    });

    if (createDto.skillIds?.length) {
      job.skills = await this.skillsService.findByIds(createDto.skillIds);
    }

    return this.jobsRepository.save(job);
  }

  async findAll(filterDto: JobFilterDto) {
    const {
      page = 1,
      limit = 10,
      keyword,
      location,
      level,
      skills,
      salaryMin,
      salaryMax,
      workType,
      sort,
      companyId
    } = filterDto;

    const query = this.jobsRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('job.skills', 'skills')
      .where('job.isActive = :isActive', { isActive: true });

    if (keyword) {
      query.andWhere('(job.title ILIKE :keyword OR company.name ILIKE :keyword)', { keyword: `%${keyword}%` });
    }

    if (companyId) {
      query.andWhere('job.companyId = :companyId', { companyId });
    }

    if (location) {
      query.andWhere('job.location ILIKE :location', { location: `%${location}%` });
    }

    if (level) {
      query.andWhere('job.level = :level', { level });
    }

    if (workType) {
      query.andWhere('job.workType = :workType', { workType });
    }

    if (salaryMin) {
      query.andWhere('job.salaryMax >= :salaryMin', { salaryMin });
    }

    if (salaryMax) {
      query.andWhere('job.salaryMin <= :salaryMax', { salaryMax });
    }

    if (skills?.length) {
      query.andWhere('skills.name IN (:...skills)', { skills });
    }

    if (sort === 'salary_desc') {
      query.orderBy('job.salaryMax', 'DESC', 'NULLS LAST');
    } else {
      query.orderBy('job.createdAt', 'DESC');
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string): Promise<Job> {
    const job = await this.jobsRepository.findOne({
      where: { id },
      relations: ['company', 'skills'],
    });
    if (!job) {
      throw new NotFoundException('Job không tồn tại');
    }
    return job;
  }

  async findByCompany(userId: string, page = 1, limit = 10) {
    const company = await this.companiesRepository.findOne({ where: { userId } });
    if (!company) {
      throw new ForbiddenException('Bạn chưa có công ty');
    }

    const [data, total] = await this.jobsRepository.findAndCount({
      where: { companyId: company.id },
      relations: ['skills'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async update(userId: string, id: string, updateDto: UpdateJobDto): Promise<Job> {
    const job = await this.findById(id);
    const company = await this.companiesRepository.findOne({ where: { userId } });

    if (job.companyId !== company?.id) {
      throw new ForbiddenException('Bạn không có quyền sửa job này');
    }

    Object.assign(job, updateDto);

    if (updateDto.skillIds) {
      job.skills = await this.skillsService.findByIds(updateDto.skillIds);
    }

    return this.jobsRepository.save(job);
  }

  async delete(userId: string, id: string): Promise<void> {
    const job = await this.findById(id);
    const company = await this.companiesRepository.findOne({ where: { userId } });

    if (job.companyId !== company?.id) {
      throw new ForbiddenException('Bạn không có quyền xóa job này');
    }

    await this.jobsRepository.remove(job);
  }
}
