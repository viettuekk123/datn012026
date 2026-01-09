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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const typeorm_1 = require("typeorm");
const job_entity_1 = require("./job.entity");
const cv_entity_1 = require("./cv.entity");
let Skill = class Skill {
};
exports.Skill = Skill;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Skill.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Skill.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Skill.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Skill.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => job_entity_1.Job, (job) => job.skills),
    __metadata("design:type", Array)
], Skill.prototype, "jobs", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => cv_entity_1.Cv, (cv) => cv.skills),
    __metadata("design:type", Array)
], Skill.prototype, "cvs", void 0);
exports.Skill = Skill = __decorate([
    (0, typeorm_1.Entity)('skills')
], Skill);
//# sourceMappingURL=skill.entity.js.map