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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../entities/user.entity");
const candidate_profile_entity_1 = require("../../entities/candidate-profile.entity");
const company_entity_1 = require("../../entities/company.entity");
let UsersService = class UsersService {
    constructor(usersRepository, candidateProfileRepository, companyRepository) {
        this.usersRepository = usersRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.companyRepository = companyRepository;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findById(id) {
        return this.usersRepository.findOne({
            where: { id },
            relations: ['candidateProfile', 'company'],
        });
    }
    async create(data) {
        const user = this.usersRepository.create(data);
        const savedUser = await this.usersRepository.save(user);
        if (data.role === user_entity_1.UserRole.CANDIDATE) {
            const profile = this.candidateProfileRepository.create({ userId: savedUser.id });
            await this.candidateProfileRepository.save(profile);
        }
        else if (data.role === user_entity_1.UserRole.EMPLOYER) {
            const company = this.companyRepository.create({ userId: savedUser.id, name: '' });
            await this.companyRepository.save(company);
        }
        return savedUser;
    }
    async findAll(page = 1, limit = 10, role) {
        const query = this.usersRepository.createQueryBuilder('user');
        if (role) {
            query.where('user.role = :role', { role });
        }
        const [data, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .orderBy('user.createdAt', 'DESC')
            .getManyAndCount();
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
    async updateStatus(id, isActive) {
        await this.usersRepository.update(id, { isActive });
        return this.findById(id);
    }
    async getProfile(userId) {
        const profile = await this.candidateProfileRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            return { message: 'Profile chưa được tạo' };
        }
        return {
            id: profile.id,
            fullName: profile.fullName,
            phone: profile.phone,
            location: profile.location,
            title: profile.title,
            experienceYears: profile.experienceYears,
            expectedSalary: profile.expectedSalary,
            workType: profile.workType,
            bio: profile.bio,
        };
    }
    async updateProfile(userId, updateData) {
        let profile = await this.candidateProfileRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            profile = this.candidateProfileRepository.create({ userId, ...updateData });
        }
        else {
            Object.assign(profile, updateData);
        }
        const saved = await this.candidateProfileRepository.save(profile);
        return {
            message: 'Cập nhật profile thành công',
            profile: {
                id: saved.id,
                fullName: saved.fullName,
                phone: saved.phone,
                location: saved.location,
                title: saved.title,
                experienceYears: saved.experienceYears,
                expectedSalary: saved.expectedSalary,
                workType: saved.workType,
                bio: saved.bio,
            },
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(candidate_profile_entity_1.CandidateProfile)),
    __param(2, (0, typeorm_1.InjectRepository)(company_entity_1.Company)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map