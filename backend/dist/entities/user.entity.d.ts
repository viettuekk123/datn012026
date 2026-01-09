import { Company } from './company.entity';
import { CandidateProfile } from './candidate-profile.entity';
import { Cv } from './cv.entity';
import { Application } from './application.entity';
export declare enum UserRole {
    ADMIN = "admin",
    EMPLOYER = "employer",
    CANDIDATE = "candidate"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    candidateProfile: CandidateProfile;
    cvs: Cv[];
    applications: Application[];
}
