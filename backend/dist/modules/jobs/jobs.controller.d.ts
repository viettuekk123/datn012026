import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobFilterDto } from './dto/job-filter.dto';
export declare class JobsController {
    private jobsService;
    constructor(jobsService: JobsService);
    findAll(filterDto: JobFilterDto): Promise<{
        data: import("../../entities").Job[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findMyJobs(req: any, page?: number, limit?: number): Promise<{
        data: import("../../entities").Job[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("../../entities").Job>;
    create(req: any, createDto: CreateJobDto): Promise<import("../../entities").Job>;
    update(req: any, id: string, updateDto: UpdateJobDto): Promise<import("../../entities").Job>;
    delete(req: any, id: string): Promise<void>;
}
