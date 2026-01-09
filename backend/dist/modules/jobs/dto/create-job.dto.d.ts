export declare class CreateJobDto {
    title: string;
    level?: string;
    experienceMin?: number;
    experienceMax?: number;
    salaryMin?: number;
    salaryMax?: number;
    salaryVisible?: boolean;
    location?: string;
    workType?: string;
    description?: string;
    requirements?: string;
    benefits?: string;
    skillIds?: number[];
    deadline?: string;
}
