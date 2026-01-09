import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { Skill } from './skill.entity';
import { Application } from './application.entity';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  level: string;

  @Column({ name: 'experience_min', default: 0 })
  experienceMin: number;

  @Column({ name: 'experience_max', nullable: true })
  experienceMax: number;

  @Column({ name: 'salary_min', nullable: true })
  salaryMin: number;

  @Column({ name: 'salary_max', nullable: true })
  salaryMax: number;

  @Column({ name: 'salary_visible', default: true })
  salaryVisible: boolean;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'work_type', default: 'onsite' })
  workType: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  requirements: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Company, (company) => company.jobs)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToMany(() => Skill, (skill) => skill.jobs)
  @JoinTable({
    name: 'job_skills',
    joinColumn: { name: 'job_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Application, (application) => application.job)
  applications: Application[];
}
