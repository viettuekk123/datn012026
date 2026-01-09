import { Repository } from 'typeorm';
import { Job } from '../../entities/job.entity';
import { Company } from '../../entities/company.entity';
import { SkillsService } from '../skills/skills.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
export declare class JobsService {
    private jobsRepository;
    private companiesRepository;
    private skillsService;
    constructor(jobsRepository: Repository<Job>, companiesRepository: Repository<Company>, skillsService: SkillsService);
    create(userId: string, createDto: CreateJobDto): Promise<Job>;
    findAll(filterDto: JobFilterDto): Promise<{
        data: Job[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<Job>;
    findByCompany(userId: string, page?: number, limit?: number): Promise<{
        data: Job[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    update(userId: string, id: string, updateDto: UpdateJobDto): Promise<Job>;
    delete(userId: string, id: string): Promise<void>;
}
