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
exports.CvParsed = void 0;
const typeorm_1 = require("typeorm");
const cv_entity_1 = require("./cv.entity");
let CvParsed = class CvParsed {
};
exports.CvParsed = CvParsed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CvParsed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cv_id' }),
    __metadata("design:type", String)
], CvParsed.prototype, "cvId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CvParsed.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CvParsed.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CvParsed.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CvParsed.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CvParsed.prototype, "positions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CvParsed.prototype, "organizations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CvParsed.prototype, "years", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CvParsed.prototype, "degrees", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], CvParsed.prototype, "schools", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parsed_at', type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", Date)
], CvParsed.prototype, "parsedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => cv_entity_1.Cv, (cv) => cv.parsed),
    (0, typeorm_1.JoinColumn)({ name: 'cv_id' }),
    __metadata("design:type", cv_entity_1.Cv)
], CvParsed.prototype, "cv", void 0);
exports.CvParsed = CvParsed = __decorate([
    (0, typeorm_1.Entity)('cv_parsed')
], CvParsed);
//# sourceMappingURL=cv-parsed.entity.js.map