import { Repository } from 'typeorm';
import { Company } from '../../entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    findById(id: string): Promise<Company>;
    findByUserId(userId: string): Promise<Company>;
    update(userId: string, updateDto: UpdateCompanyDto): Promise<Company>;
    findAll(page?: number, limit?: number): Promise<{
        data: Company[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
