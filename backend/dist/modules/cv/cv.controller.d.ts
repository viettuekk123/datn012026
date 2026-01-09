import { CvService } from './cv.service';
export declare class CvController {
    private cvService;
    constructor(cvService: CvService);
    upload(req: any, file: Express.Multer.File): Promise<{
        message: string;
        cv: {
            id: string;
            filename: string;
            fileUrl: string;
            parsed: import("../../entities").CvParsed[];
        };
    }>;
    findMyCvs(req: any): Promise<{
        data: {
            skills: string[];
            id: string;
            userId: string;
            filename: string;
            fileUrl: string;
            fileType: string;
            rawText: string;
            isDefault: boolean;
            uploadedAt: Date;
            user: import("../../entities/user.entity").User;
            parsed: import("../../entities").CvParsed;
            applications: import("../../entities").Application[];
        }[];
    }>;
    findOne(req: any, id: string): Promise<import("../../entities").Cv>;
    setDefault(req: any, id: string): Promise<import("../../entities").Cv>;
    delete(req: any, id: string): Promise<void>;
}
