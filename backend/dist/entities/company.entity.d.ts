import { User } from './user.entity';
import { Job } from './job.entity';
export declare class Company {
    id: string;
    userId: string;
    name: string;
    logoUrl: string;
    description: string;
    companySize: string;
    location: string;
    website: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    jobs: Job[];
}
