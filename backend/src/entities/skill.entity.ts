import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Job } from './job.entity';
import { Cv } from './cv.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  category: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];

  @ManyToMany(() => Cv, (cv) => cv.skills)
  cvs: Cv[];
}
