import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Company } from './company.entity';
import { CandidateProfile } from './candidate-profile.entity';
import { Cv } from './cv.entity';
import { Application } from './application.entity';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  CANDIDATE = 'candidate',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Company, (company) => company.user)
  company: Company;

  @OneToOne(() => CandidateProfile, (profile) => profile.user)
  candidateProfile: CandidateProfile;

  @OneToMany(() => Cv, (cv) => cv.user)
  cvs: Cv[];

  @OneToMany(() => Application, (application) => application.candidate)
  applications: Application[];
}
