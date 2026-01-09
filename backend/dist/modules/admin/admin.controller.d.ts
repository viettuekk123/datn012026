import { AdminService } from './admin.service';
import { UserRole } from '../../entities/user.entity';
export declare class AdminController {
    private adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        total_candidates: number;
        total_employers: number;
        total_jobs: number;
        total_applications: number;
        total_cvs: number;
        jobs_by_level: Record<string, number>;
    }>;
    getUsers(page?: number, limit?: number, role?: string, isActive?: string): Promise<{
        data: {
            id: string;
            email: string;
            role: UserRole;
            isActive: boolean;
            createdAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateUser(id: string, body: {
        isActive: boolean;
    }): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            isActive: boolean;
        };
    }>;
}
