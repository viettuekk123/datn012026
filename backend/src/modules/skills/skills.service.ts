import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Skill } from '../../entities/skill.entity';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillsRepository: Repository<Skill>,
  ) {}

  async findAll(category?: string) {
    const query = this.skillsRepository.createQueryBuilder('skill');
    if (category) {
      query.where('skill.category = :category', { category });
    }
    return query.orderBy('skill.name', 'ASC').getMany();
  }

  async findByIds(ids: number[]): Promise<Skill[]> {
    return this.skillsRepository.findBy({ id: In(ids) });
  }

  async findByNames(names: string[]): Promise<Skill[]> {
    return this.skillsRepository.findBy({ name: In(names) });
  }

  async findOrCreate(names: string[]): Promise<Skill[]> {
    const skills: Skill[] = [];
    for (const name of names) {
      let skill = await this.skillsRepository.findOne({ where: { name } });
      if (!skill) {
        skill = this.skillsRepository.create({ name, category: 'other' });
        skill = await this.skillsRepository.save(skill);
      }
      skills.push(skill);
    }
    return skills;
  }
}
