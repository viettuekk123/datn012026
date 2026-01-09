import { SkillsService } from './skills.service';
export declare class SkillsController {
    private skillsService;
    constructor(skillsService: SkillsService);
    findAll(category?: string): Promise<import("../../entities").Skill[]>;
    getCategories(): {
        data: string[];
    };
}
