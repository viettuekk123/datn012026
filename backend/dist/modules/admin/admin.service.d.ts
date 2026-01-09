import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Job } from '../../entities/job.entity';
import { Application } from '../../entities/application.entity';
import { Cv } from '../../entities/cv.entity';
export declare class AdminService {
    private usersRepository;
    private jobsRepository;
    private applicationsRepository;
    private cvsRepository;
    constructor(usersRepository: Repository<User>, jobsRepository: Repository<Job>, applicationsRepository: Repository<Application>, cvsRepository: Repository<Cv>);
    getStats(): Promise<{
        total_candidates: number;
        total_employers: number;
        total_jobs: number;
        total_applications: number;
        total_cvs: number;
        jobs_by_level: Record<string, number>;
    }>;
    getUsers(page: number, limit: number, role?: string, isActive?: boolean): Promise<{
        data: {
            id: string;
            email: string;
            role: UserRole;
            isActive: boolean;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(id: string, isActive: boolean): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            isActive: boolean;
        };
    }>;
}
