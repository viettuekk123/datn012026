import { Cv } from './cv.entity';
export declare class CvParsed {
    id: string;
    cvId: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    positions: string[];
    organizations: string[];
    years: string[];
    degrees: string[];
    schools: string[];
    parsedAt: Date;
    cv: Cv;
}
