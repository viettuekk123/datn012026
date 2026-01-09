import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cv } from './cv.entity';

@Entity('cv_parsed')
export class CvParsed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'cv_id' })
  cvId: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', default: [] })
  positions: string[];

  @Column({ type: 'jsonb', default: [] })
  organizations: string[];

  @Column({ type: 'jsonb', default: [] })
  years: string[];

  @Column({ type: 'jsonb', default: [] })
  degrees: string[];

  @Column({ type: 'jsonb', default: [] })
  schools: string[];

  @Column({ name: 'parsed_at', type: 'timestamp', default: () => 'NOW()' })
  parsedAt: Date;

  @OneToOne(() => Cv, (cv) => cv.parsed)
  @JoinColumn({ name: 'cv_id' })
  cv: Cv;
}
