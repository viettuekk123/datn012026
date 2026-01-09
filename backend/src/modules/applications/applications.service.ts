import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from '../../entities/application.entity';
import { Job } from '../../entities/job.entity';
import { Company } from '../../entities/company.entity';
import { CvService } from '../cv/cv.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApplicationFilterDto } from './dto/application-filter.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
    private cvService: CvService,
  ) {}

  async create(userId: string, createDto: CreateApplicationDto) {
    const job = await this.jobsRepository.findOne({
      where: { id: createDto.jobId },
      relations: ['skills'],
    });

    if (!job) {
      throw new NotFoundException('Job không tồn tại');
    }

    if (!job.isActive) {
      throw new ForbiddenException('Job đã đóng');
    }

    // Check if already applied
    const existing = await this.applicationsRepository.findOne({
      where: { jobId: createDto.jobId, candidateId: userId },
    });

    if (existing) {
      throw new ConflictException('Bạn đã nộp đơn cho job này');
    }

    // Get CV
    let cv;
    if (createDto.cvId) {
      cv = await this.cvService.findById(createDto.cvId, userId);
    } else {
      cv = await this.cvService.getDefaultCv(userId);
      if (!cv) {
        throw new ForbiddenException('Bạn chưa có CV. Vui lòng upload CV trước');
      }
    }

    // Calculate match score
    const matchScore = this.calculateMatchScore(cv.skills || [], job.skills || []);

    const application = this.applicationsRepository.create({
      jobId: createDto.jobId,
      candidateId: userId,
      cvId: cv.id,
      matchScore,
    });

    const saved = await this.applicationsRepository.save(application);

    return {
      message: 'Nộp đơn thành công',
      application: {
        id: saved.id,
        jobId: saved.jobId,
        cvId: saved.cvId,
        matchScore: saved.matchScore,
        status: saved.status,
        appliedAt: saved.appliedAt,
      },
    };
  }

  private calculateMatchScore(cvSkills: any[], jobSkills: any[]): number {
    if (!jobSkills.length) return 0;

    const cvSkillNames = cvSkills.map((s) => s.name?.toLowerCase() || s.toLowerCase());
    const jobSkillNames = jobSkills.map((s) => s.name?.toLowerCase() || s.toLowerCase());

    const matched = jobSkillNames.filter((skill) => cvSkillNames.includes(skill)).length;
    return Math.round((matched / jobSkillNames.length) * 100);
  }

  async findByCandidate(userId: string) {
    const applications = await this.applicationsRepository.find({
      where: { candidateId: userId },
      relations: ['job', 'job.company'],
      order: { appliedAt: 'DESC' },
    });

    return {
      data: applications.map((app) => ({
        id: app.id,
        job: {
          id: app.job.id,
          title: app.job.title,
          company: {
            name: app.job.company.name,
            logoUrl: app.job.company.logoUrl,
          },
        },
        matchScore: app.matchScore,
        status: app.status,
        appliedAt: app.appliedAt,
      })),
    };
  }

  async findByJob(userId: string, jobId: string, filterDto: ApplicationFilterDto) {
    const { page = 1, limit = 10, skills, matchMin, status, sort } = filterDto;

    // Verify job ownership
    const job = await this.jobsRepository.findOne({
      where: { id: jobId },
      relations: ['company'],
    });

    if (!job) {
      throw new NotFoundException('Job không tồn tại');
    }

    const company = await this.companiesRepository.findOne({ where: { userId } });
    if (job.companyId !== company?.id) {
      throw new ForbiddenException('Bạn không có quyền xem ứng viên của job này');
    }

    const query = this.applicationsRepository
      .createQueryBuilder('app')
      .leftJoinAndSelect('app.cv', 'cv')
      .leftJoinAndSelect('cv.parsed', 'parsed')
      .leftJoinAndSelect('cv.skills', 'skills')
      .where('app.jobId = :jobId', { jobId });

    if (status) {
      query.andWhere('app.status = :status', { status });
    }

    if (matchMin) {
      query.andWhere('app.matchScore >= :matchMin', { matchMin });
    }

    if (skills?.length) {
      query.andWhere('skills.name IN (:...skills)', { skills });
    }

    if (sort === 'match_desc') {
      query.orderBy('app.matchScore', 'DESC');
    } else {
      query.orderBy('app.appliedAt', 'DESC');
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: data.map((app) => ({
        id: app.id,
        candidate: {
          name: app.cv?.parsed?.name,
          email: app.cv?.parsed?.email,
          phone: app.cv?.parsed?.phone,
        },
        cvId: app.cvId,
        skills: app.cv?.skills?.map((s) => s.name) || [],
        matchScore: app.matchScore,
        status: app.status,
        appliedAt: app.appliedAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(userId: string, id: string, updateDto: UpdateStatusDto) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['job', 'job.company'],
    });

    if (!application) {
      throw new NotFoundException('Đơn ứng tuyển không tồn tại');
    }

    const company = await this.companiesRepository.findOne({ where: { userId } });
    if (application.job.companyId !== company?.id) {
      throw new ForbiddenException('Bạn không có quyền cập nhật đơn này');
    }

    application.status = updateDto.status as ApplicationStatus;
    if (updateDto.note) {
      application.employerNote = updateDto.note;
    }

    return this.applicationsRepository.save(application);
  }
}
