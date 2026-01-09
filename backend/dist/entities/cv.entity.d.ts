import { User } from './user.entity';
import { CvParsed } from './cv-parsed.entity';
import { Skill } from './skill.entity';
import { Application } from './application.entity';
export declare class Cv {
    id: string;
    userId: string;
    filename: string;
    fileUrl: string;
    fileType: string;
    rawText: string;
    isDefault: boolean;
    uploadedAt: Date;
    user: User;
    parsed: CvParsed;
    skills: Skill[];
    applications: Application[];
}
