import { User } from './user.entity';
export declare class CandidateProfile {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    location: string;
    title: string;
    experienceYears: number;
    expectedSalary: number;
    workType: string;
    bio: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
}
