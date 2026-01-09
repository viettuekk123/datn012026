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
exports.CvService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const cv_entity_1 = require("../../entities/cv.entity");
const cv_parsed_entity_1 = require("../../entities/cv-parsed.entity");
const skills_service_1 = require("../skills/skills.service");
const path = require("path");
const fs = require("fs");
let CvService = class CvService {
    constructor(cvRepository, cvParsedRepository, skillsService, configService) {
        this.cvRepository = cvRepository;
        this.cvParsedRepository = cvParsedRepository;
        this.skillsService = skillsService;
        this.configService = configService;
    }
    async upload(userId, file) {
        const uploadDir = path.join(process.cwd(), 'uploads', 'cvs');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filename = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        const ext = path.extname(file.originalname).toLowerCase();
        let fileType = 'pdf';
        if (['.doc', '.docx'].includes(ext))
            fileType = 'docx';
        if (['.png', '.jpg', '.jpeg'].includes(ext))
            fileType = 'image';
        const cv = this.cvRepository.create({
            userId,
            filename: file.originalname,
            fileUrl: `/uploads/cvs/${filename}`,
            fileType,
        });
        const existingCvs = await this.cvRepository.count({ where: { userId } });
        if (existingCvs === 0) {
            cv.isDefault = true;
        }
        const savedCv = await this.cvRepository.save(cv);
        const parsedData = await this.parseWithNer(filePath);
        const cvParsed = this.cvParsedRepository.create({
            cvId: savedCv.id,
            ...parsedData,
        });
        await this.cvParsedRepository.save(cvParsed);
        if (parsedData.skills?.length) {
            const skills = await this.skillsService.findOrCreate(parsedData.skills);
            savedCv.skills = skills;
            await this.cvRepository.save(savedCv);
        }
        return {
            message: 'Upload và parse CV thành công',
            cv: {
                id: savedCv.id,
                filename: savedCv.filename,
                fileUrl: savedCv.fileUrl,
                parsed: cvParsed,
            },
        };
    }
    async parseWithNer(filePath) {
        const nerUrl = this.configService.get('NER_SERVICE_URL');
        try {
            const FormData = (await Promise.resolve().then(() => require('form-data'))).default;
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            const response = await fetch(`${nerUrl}/extract`, {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                throw new Error('NER service error');
            }
            const result = await response.json();
            return {
                name: result.data?.name?.[0] || null,
                email: result.data?.email?.[0] || null,
                phone: result.data?.phone?.[0] || null,
                location: result.data?.location?.[0] || null,
                positions: result.data?.position || [],
                organizations: result.data?.organization || [],
                skills: result.data?.skills || [],
                degrees: result.data?.education?.degrees || [],
                schools: result.data?.education?.schools || [],
            };
        }
        catch (error) {
            console.error('NER service error:', error);
            return {
                name: null,
                email: null,
                phone: null,
                location: null,
                positions: [],
                organizations: [],
                skills: [],
                degrees: [],
                schools: [],
            };
        }
    }
    async findByUser(userId) {
        const cvs = await this.cvRepository.find({
            where: { userId },
            relations: ['parsed', 'skills'],
            order: { uploadedAt: 'DESC' },
        });
        return {
            data: cvs.map((cv) => ({
                ...cv,
                skills: cv.skills?.map((s) => s.name) || [],
            })),
        };
    }
    async findById(id, userId) {
        const cv = await this.cvRepository.findOne({
            where: { id },
            relations: ['parsed', 'skills'],
        });
        if (!cv) {
            throw new common_1.NotFoundException('CV không tồn tại');
        }
        if (userId && cv.userId !== userId) {
            throw new common_1.ForbiddenException('Bạn không có quyền xem CV này');
        }
        return cv;
    }
    async setDefault(userId, id) {
        const cv = await this.findById(id, userId);
        await this.cvRepository.update({ userId }, { isDefault: false });
        cv.isDefault = true;
        return this.cvRepository.save(cv);
    }
    async delete(userId, id) {
        const cv = await this.findById(id, userId);
        await this.cvRepository.remove(cv);
    }
    async getDefaultCv(userId) {
        return this.cvRepository.findOne({
            where: { userId, isDefault: true },
            relations: ['skills'],
        });
    }
};
exports.CvService = CvService;
exports.CvService = CvService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cv_entity_1.Cv)),
    __param(1, (0, typeorm_1.InjectRepository)(cv_parsed_entity_1.CvParsed)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        skills_service_1.SkillsService,
        config_1.ConfigService])
], CvService);
//# sourceMappingURL=cv.service.js.map