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
exports.Cv = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const cv_parsed_entity_1 = require("./cv-parsed.entity");
const skill_entity_1 = require("./skill.entity");
const application_entity_1 = require("./application.entity");
let Cv = class Cv {
};
exports.Cv = Cv;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Cv.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], Cv.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Cv.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_url', nullable: true }),
    __metadata("design:type", String)
], Cv.prototype, "fileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'file_type', nullable: true }),
    __metadata("design:type", String)
], Cv.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'raw_text', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cv.prototype, "rawText", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_default', default: false }),
    __metadata("design:type", Boolean)
], Cv.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'uploaded_at', type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], Cv.prototype, "uploadedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.cvs),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Cv.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cv_parsed_entity_1.CvParsed, (cvParsed) => cvParsed.cv),
    __metadata("design:type", cv_parsed_entity_1.CvParsed)
], Cv.prototype, "parsed", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => skill_entity_1.Skill, (skill) => skill.cvs),
    (0, typeorm_1.JoinTable)({
        name: 'cv_skills',
        joinColumn: { name: 'cv_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Cv.prototype, "skills", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => application_entity_1.Application, (application) => application.cv),
    __metadata("design:type", Array)
], Cv.prototype, "applications", void 0);
exports.Cv = Cv = __decorate([
    (0, typeorm_1.Entity)('cvs')
], Cv);
//# sourceMappingURL=cv.entity.js.map