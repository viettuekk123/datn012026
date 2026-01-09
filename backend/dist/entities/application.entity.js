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
exports.Application = exports.ApplicationStatus = void 0;
const typeorm_1 = require("typeorm");
const job_entity_1 = require("./job.entity");
const user_entity_1 = require("./user.entity");
const cv_entity_1 = require("./cv.entity");
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "pending";
    ApplicationStatus["ACCEPTED"] = "accepted";
    ApplicationStatus["REJECTED"] = "rejected";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
let Application = class Application {
};
exports.Application = Application;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Application.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'job_id' }),
    __metadata("design:type", String)
], Application.prototype, "jobId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'candidate_id' }),
    __metadata("design:type", String)
], Application.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_id' }),
    __metadata("design:type", String)
], Application.prototype, "cvId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'match_score', type: 'decimal', precision: 5, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Application.prototype, "matchScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.PENDING,
    }),
    __metadata("design:type", String)
], Application.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'employer_note', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Application.prototype, "employerNote", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'applied_at' }),
    __metadata("design:type", Date)
], Application.prototype, "appliedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Application.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => job_entity_1.Job, (job) => job.applications),
    (0, typeorm_1.JoinColumn)({ name: 'job_id' }),
    __metadata("design:type", job_entity_1.Job)
], Application.prototype, "job", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.applications),
    (0, typeorm_1.JoinColumn)({ name: 'candidate_id' }),
    __metadata("design:type", user_entity_1.User)
], Application.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cv_entity_1.Cv, (cv) => cv.applications),
    (0, typeorm_1.JoinColumn)({ name: 'cv_id' }),
    __metadata("design:type", cv_entity_1.Cv)
], Application.prototype, "cv", void 0);
exports.Application = Application = __decorate([
    (0, typeorm_1.Entity)('applications'),
    (0, typeorm_1.Unique)(['jobId', 'candidateId'])
], Application);
//# sourceMappingURL=application.entity.js.map