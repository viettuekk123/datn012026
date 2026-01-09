import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class ProfileController {
    private usersService;
    constructor(usersService: UsersService);
    getMyProfile(req: any): Promise<{
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
    updateMyProfile(req: any, updateDto: UpdateProfileDto): Promise<{
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
