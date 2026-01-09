import { Repository } from 'typeorm';
import { Skill } from '../../entities/skill.entity';
export declare class SkillsService {
    private skillsRepository;
    constructor(skillsRepository: Repository<Skill>);
    findAll(category?: string): Promise<Skill[]>;
    findByIds(ids: number[]): Promise<Skill[]>;
    findByNames(names: string[]): Promise<Skill[]>;
    findOrCreate(names: string[]): Promise<Skill[]>;
}
