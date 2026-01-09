import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: import("../../entities").UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import("../../entities").UserRole;
        };
    }>;
    getProfile(req: any): Promise<{
        id: string;
        email: string;
        role: import("../../entities").UserRole;
        profile: import("../../entities").Company | import("../../entities").CandidateProfile;
    }>;
}
