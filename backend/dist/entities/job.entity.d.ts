import { Company } from './company.entity';
import { Skill } from './skill.entity';
import { Application } from './application.entity';
export declare class Job {
    id: string;
    companyId: string;
    title: string;
    level: string;
    experienceMin: number;
    experienceMax: number;
    salaryMin: number;
    salaryMax: number;
    salaryVisible: boolean;
    location: string;
    workType: string;
    description: string;
    requirements: string;
    benefits: string;
    isActive: boolean;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
    company: Company;
    skills: Skill[];
    applications: Application[];
}
