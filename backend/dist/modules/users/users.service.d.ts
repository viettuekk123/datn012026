import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { CandidateProfile } from '../../entities/candidate-profile.entity';
import { Company } from '../../entities/company.entity';
export declare class UsersService {
    private usersRepository;
    private candidateProfileRepository;
    private companyRepository;
    constructor(usersRepository: Repository<User>, candidateProfileRepository: Repository<CandidateProfile>, companyRepository: Repository<Company>);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        passwordHash: string;
        role: UserRole;
    }): Promise<User>;
    findAll(page?: number, limit?: number, role?: UserRole): Promise<{
        data: User[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateStatus(id: string, isActive: boolean): Promise<User>;
    getProfile(userId: string): Promise<{
        message: string;
        id?: undefined;
        fullName?: undefined;
        phone?: undefined;
        location?: undefined;
        title?: undefined;
        experienceYears?: undefined;
        expectedSalary?: undefined;
        workType?: undefined;
        bio?: undefined;
    } | {
        id: string;
        fullName: string;
        phone: string;
        location: string;
        title: string;
        experienceYears: number;
        expectedSalary: number;
        workType: string;
        bio: string;
        message?: undefined;
    }>;
    updateProfile(userId: string, updateData: Partial<CandidateProfile>): Promise<{
        message: string;
        profile: {
            id: string;
            fullName: string;
            phone: string;
            location: string;
            title: string;
            experienceYears: number;
            expectedSalary: number;
            workType: string;
            bio: string;
        };
    }>;
}
