import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ApplicationFilterDto } from './dto/application-filter.dto';
export declare class ApplicationsController {
    private applicationsService;
    constructor(applicationsService: ApplicationsService);
    create(req: any, createDto: CreateApplicationDto): Promise<{
        message: string;
        application: {
            id: string;
            jobId: string;
            cvId: string;
            matchScore: number;
            status: import("../../entities").ApplicationStatus;
            appliedAt: Date;
        };
    }>;
    findMyApplications(req: any): Promise<{
        data: {
            id: string;
            job: {
                id: string;
                title: string;
                company: {
                    name: string;
                    logoUrl: string;
                };
            };
            matchScore: number;
            status: import("../../entities").ApplicationStatus;
            appliedAt: Date;
        }[];
    }>;
    findByJob(req: any, jobId: string, filterDto: ApplicationFilterDto): Promise<{
        data: {
            id: string;
            candidate: {
                name: string;
                email: string;
                phone: string;
            };
            cvId: string;
            skills: string[];
            matchScore: number;
            status: import("../../entities").ApplicationStatus;
            appliedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateStatus(req: any, id: string, updateDto: UpdateStatusDto): Promise<import("../../entities").Application>;
}
