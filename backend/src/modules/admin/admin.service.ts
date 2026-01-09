import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Job } from '../../entities/job.entity';
import { Application } from '../../entities/application.entity';
import { Cv } from '../../entities/cv.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Job)
        private jobsRepository: Repository<Job>,
        @InjectRepository(Application)
        private applicationsRepository: Repository<Application>,
        @InjectRepository(Cv)
        private cvsRepository: Repository<Cv>,
    ) { }

    async getStats() {
        const [totalCandidates, totalEmployers, totalJobs, totalApplications, totalCvs] =
            await Promise.all([
                this.usersRepository.count({ where: { role: UserRole.CANDIDATE } }),
                this.usersRepository.count({ where: { role: UserRole.EMPLOYER } }),
                this.jobsRepository.count(),
                this.applicationsRepository.count(),
                this.cvsRepository.count(),
            ]);

        // Jobs by level
        const jobsByLevel = await this.jobsRepository
            .createQueryBuilder('job')
            .select('job.level', 'level')
            .addSelect('COUNT(*)', 'count')
            .groupBy('job.level')
            .getRawMany();

        const jobsByLevelMap: Record<string, number> = {};
        jobsByLevel.forEach((item) => {
            jobsByLevelMap[item.level] = parseInt(item.count);
        });

        return {
            total_candidates: totalCandidates,
            total_employers: totalEmployers,
            total_jobs: totalJobs,
            total_applications: totalApplications,
            total_cvs: totalCvs,
            jobs_by_level: jobsByLevelMap,
        };
    }

    async getUsers(page: number, limit: number, role?: string, isActive?: boolean) {
        const query = this.usersRepository.createQueryBuilder('user');

        if (role) {
            query.andWhere('user.role = :role', { role });
        }

        if (isActive !== undefined) {
            query.andWhere('user.isActive = :isActive', { isActive });
        }

        query.orderBy('user.createdAt', 'DESC');

        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        return {
            data: data.map((user) => ({
                id: user.id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            })),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async updateUser(id: string, isActive: boolean) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User không tồn tại');
        }

        user.isActive = isActive;
        await this.usersRepository.save(user);

        return {
            message: isActive ? 'Đã mở khóa user' : 'Đã khóa user',
            user: {
                id: user.id,
                email: user.email,
                isActive: user.isActive,
            },
        };
    }
}
