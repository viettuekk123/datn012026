import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cv } from '../../entities/cv.entity';
import { CvParsed } from '../../entities/cv-parsed.entity';
import { SkillsService } from '../skills/skills.service';
export declare class CvService {
    private cvRepository;
    private cvParsedRepository;
    private skillsService;
    private configService;
    constructor(cvRepository: Repository<Cv>, cvParsedRepository: Repository<CvParsed>, skillsService: SkillsService, configService: ConfigService);
    upload(userId: string, file: Express.Multer.File): Promise<{
        message: string;
        cv: {
            id: string;
            filename: string;
            fileUrl: string;
            parsed: CvParsed[];
        };
    }>;
    private parseWithNer;
    findByUser(userId: string): Promise<{
        data: {
            skills: string[];
            id: string;
            userId: string;
            filename: string;
            fileUrl: string;
            fileType: string;
            rawText: string;
            isDefault: boolean;
            uploadedAt: Date;
            user: import("../../entities").User;
            parsed: CvParsed;
            applications: import("../../entities").Application[];
        }[];
    }>;
    findById(id: string, userId?: string): Promise<Cv>;
    setDefault(userId: string, id: string): Promise<Cv>;
    delete(userId: string, id: string): Promise<void>;
    getDefaultCv(userId: string): Promise<Cv | null>;
}
