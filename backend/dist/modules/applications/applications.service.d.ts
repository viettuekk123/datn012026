import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from '../../entities/application.entity';
import { Job } from '../../entities/job.entity';
import { Company } from '../../entities/company.entity';
import { CvService } from '../cv/cv.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApplicationFilterDto } from './dto/application-filter.dto';
export declare class ApplicationsService {
    private applicationsRepository;
    private jobsRepository;
    private companiesRepository;
    private cvService;
    constructor(applicationsRepository: Repository<Application>, jobsRepository: Repository<Job>, companiesRepository: Repository<Company>, cvService: CvService);
    create(userId: string, createDto: CreateApplicationDto): Promise<{
        message: string;
        application: {
            id: string;
            jobId: string;
            cvId: string;
            matchScore: number;
            status: ApplicationStatus;
            appliedAt: Date;
        };
    }>;
    private calculateMatchScore;
    findByCandidate(userId: string): Promise<{
        data: {
            id: string;
            job: {
                id: string;
                title: string;
                company: {
                    name: string;
                    logoUrl: string;
                };
            };
            matchScore: number;
            status: ApplicationStatus;
            appliedAt: Date;
        }[];
    }>;
    findByJob(userId: string, jobId: string, filterDto: ApplicationFilterDto): Promise<{
        data: {
            id: string;
            candidate: {
                name: string;
                email: string;
                phone: string;
            };
            cvId: string;
            skills: string[];
            matchScore: number;
            status: ApplicationStatus;
            appliedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateStatus(userId: string, id: string, updateDto: UpdateStatusDto): Promise<Application>;
}
