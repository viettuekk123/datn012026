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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("../../entities/application.entity");
const job_entity_1 = require("../../entities/job.entity");
const company_entity_1 = require("../../entities/company.entity");
const cv_service_1 = require("../cv/cv.service");
let ApplicationsService = class ApplicationsService {
    constructor(applicationsRepository, jobsRepository, companiesRepository, cvService) {
        this.applicationsRepository = applicationsRepository;
        this.jobsRepository = jobsRepository;
        this.companiesRepository = companiesRepository;
        this.cvService = cvService;
    }
    async create(userId, createDto) {
        const job = await this.jobsRepository.findOne({
            where: { id: createDto.jobId },
            relations: ['skills'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job không tồn tại');
        }
        if (!job.isActive) {
            throw new common_1.ForbiddenException('Job đã đóng');
        }
        const existing = await this.applicationsRepository.findOne({
            where: { jobId: createDto.jobId, candidateId: userId },
        });
        if (existing) {
            throw new common_1.ConflictException('Bạn đã nộp đơn cho job này');
        }
        let cv;
        if (createDto.cvId) {
            cv = await this.cvService.findById(createDto.cvId, userId);
        }
        else {
            cv = await this.cvService.getDefaultCv(userId);
            if (!cv) {
                throw new common_1.ForbiddenException('Bạn chưa có CV. Vui lòng upload CV trước');
            }
        }
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
    calculateMatchScore(cvSkills, jobSkills) {
        if (!jobSkills.length)
            return 0;
        const cvSkillNames = cvSkills.map((s) => s.name?.toLowerCase() || s.toLowerCase());
        const jobSkillNames = jobSkills.map((s) => s.name?.toLowerCase() || s.toLowerCase());
        const matched = jobSkillNames.filter((skill) => cvSkillNames.includes(skill)).length;
        return Math.round((matched / jobSkillNames.length) * 100);
    }
    async findByCandidate(userId) {
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
    async findByJob(userId, jobId, filterDto) {
        const { page = 1, limit = 10, skills, matchMin, status, sort } = filterDto;
        const job = await this.jobsRepository.findOne({
            where: { id: jobId },
            relations: ['company'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job không tồn tại');
        }
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (job.companyId !== company?.id) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem ứng viên của job này');
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
        }
        else {
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
    async updateStatus(userId, id, updateDto) {
        const application = await this.applicationsRepository.findOne({
            where: { id },
            relations: ['job', 'job.company'],
        });
        if (!application) {
            throw new common_1.NotFoundException('Đơn ứng tuyển không tồn tại');
        }
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (application.job.companyId !== company?.id) {
            throw new common_1.ForbiddenException('Bạn không có quyền cập nhật đơn này');
        }
        application.status = updateDto.status;
        if (updateDto.note) {
            application.employerNote = updateDto.note;
        }
        return this.applicationsRepository.save(application);
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cv_service_1.CvService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map