import { Job } from './job.entity';
import { User } from './user.entity';
import { Cv } from './cv.entity';
export declare enum ApplicationStatus {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}
export declare class Application {
    id: string;
    jobId: string;
    candidateId: string;
    cvId: string;
    matchScore: number;
    status: ApplicationStatus;
    employerNote: string;
    appliedAt: Date;
    updatedAt: Date;
    job: Job;
    candidate: User;
    cv: Cv;
}
