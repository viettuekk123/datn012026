"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const job_entity_1 = require("../../entities/job.entity");
const application_entity_1 = require("../../entities/application.entity");
const cv_entity_1 = require("../../entities/cv.entity");
let AdminService = class AdminService {
    constructor(usersRepository, jobsRepository, applicationsRepository, cvsRepository) {
        this.usersRepository = usersRepository;
        this.jobsRepository = jobsRepository;
        this.applicationsRepository = applicationsRepository;
        this.cvsRepository = cvsRepository;
    }
    async getStats() {
        const [totalCandidates, totalEmployers, totalJobs, totalApplications, totalCvs] = await Promise.all([
            this.usersRepository.count({ where: { role: user_entity_1.UserRole.CANDIDATE } }),
            this.usersRepository.count({ where: { role: user_entity_1.UserRole.EMPLOYER } }),
            this.jobsRepository.count(),
            this.applicationsRepository.count(),
            this.cvsRepository.count(),
        ]);
        const jobsByLevel = await this.jobsRepository
            .createQueryBuilder('job')
            .select('job.level', 'level')
            .addSelect('COUNT(*)', 'count')
            .groupBy('job.level')
            .getRawMany();
        const jobsByLevelMap = {};
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
    async getUsers(page, limit, role, isActive) {
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
    async updateUser(id, isActive) {
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(3, (0, typeorm_1.InjectRepository)(cv_entity_1.Cv)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map