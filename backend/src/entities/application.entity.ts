import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Job } from './job.entity';
import { User } from './user.entity';
import { Cv } from './cv.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
@Unique(['jobId', 'candidateId'])
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_id' })
  jobId: string;

  @Column({ name: 'candidate_id' })
  candidateId: string;

  @Column({ name: 'cv_id' })
  cvId: string;

  @Column({ name: 'match_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  matchScore: number;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ name: 'employer_note', type: 'text', nullable: true })
  employerNote: string;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Job, (job) => job.applications)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'candidate_id' })
  candidate: User;

  @ManyToOne(() => Cv, (cv) => cv.applications)
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}
