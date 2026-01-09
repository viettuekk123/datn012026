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
exports.SkillsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const skill_entity_1 = require("../../entities/skill.entity");
let SkillsService = class SkillsService {
    constructor(skillsRepository) {
        this.skillsRepository = skillsRepository;
    }
    async findAll(category) {
        const query = this.skillsRepository.createQueryBuilder('skill');
        if (category) {
            query.where('skill.category = :category', { category });
        }
        return query.orderBy('skill.name', 'ASC').getMany();
    }
    async findByIds(ids) {
        return this.skillsRepository.findBy({ id: (0, typeorm_2.In)(ids) });
    }
    async findByNames(names) {
        return this.skillsRepository.findBy({ name: (0, typeorm_2.In)(names) });
    }
    async findOrCreate(names) {
        const skills = [];
        for (const name of names) {
            let skill = await this.skillsRepository.findOne({ where: { name } });
            if (!skill) {
                skill = this.skillsRepository.create({ name, category: 'other' });
                skill = await this.skillsRepository.save(skill);
            }
            skills.push(skill);
        }
        return skills;
    }
};
exports.SkillsService = SkillsService;
exports.SkillsService = SkillsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(skill_entity_1.Skill)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SkillsService);
//# sourceMappingURL=skills.service.js.map