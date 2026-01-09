import { CompaniesService } from './companies.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private companiesService;
    constructor(companiesService: CompaniesService);
    findAll(page?: number, limit?: number): Promise<{
        data: import("../../entities").Company[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyCompany(req: any): Promise<import("../../entities").Company>;
    findOne(id: string): Promise<import("../../entities").Company>;
    update(req: any, updateDto: UpdateCompanyDto): Promise<import("../../entities").Company>;
}
