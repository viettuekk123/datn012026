import { Job } from './job.entity';
import { Cv } from './cv.entity';
export declare class Skill {
    id: number;
    name: string;
    category: string;
    createdAt: Date;
    jobs: Job[];
    cvs: Cv[];
}
