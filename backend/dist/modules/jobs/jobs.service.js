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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const job_entity_1 = require("../../entities/job.entity");
const company_entity_1 = require("../../entities/company.entity");
const skills_service_1 = require("../skills/skills.service");
let JobsService = class JobsService {
    constructor(jobsRepository, companiesRepository, skillsService) {
        this.jobsRepository = jobsRepository;
        this.companiesRepository = companiesRepository;
        this.skillsService = skillsService;
    }
    async create(userId, createDto) {
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (!company) {
            throw new common_1.ForbiddenException('Bạn chưa có công ty');
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
    async findAll(filterDto) {
        const { page = 1, limit = 10, keyword, location, level, skills, salaryMin, salaryMax, workType, sort, companyId } = filterDto;
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
        }
        else {
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
    async findById(id) {
        const job = await this.jobsRepository.findOne({
            where: { id },
            relations: ['company', 'skills'],
        });
        if (!job) {
            throw new common_1.NotFoundException('Job không tồn tại');
        }
        return job;
    }
    async findByCompany(userId, page = 1, limit = 10) {
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (!company) {
            throw new common_1.ForbiddenException('Bạn chưa có công ty');
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
    async update(userId, id, updateDto) {
        const job = await this.findById(id);
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (job.companyId !== company?.id) {
            throw new common_1.ForbiddenException('Bạn không có quyền sửa job này');
        }
        Object.assign(job, updateDto);
        if (updateDto.skillIds) {
            job.skills = await this.skillsService.findByIds(updateDto.skillIds);
        }
        return this.jobsRepository.save(job);
    }
    async delete(userId, id) {
        const job = await this.findById(id);
        const company = await this.companiesRepository.findOne({ where: { userId } });
        if (job.companyId !== company?.id) {
            throw new common_1.ForbiddenException('Bạn không có quyền xóa job này');
        }
        await this.jobsRepository.remove(job);
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(job_entity_1.Job)),
    __param(1, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        skills_service_1.SkillsService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map