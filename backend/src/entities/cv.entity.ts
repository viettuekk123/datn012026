import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { CvParsed } from './cv-parsed.entity';
import { Skill } from './skill.entity';
import { Application } from './application.entity';

@Entity('cvs')
export class Cv {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  filename: string;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;

  @Column({ name: 'file_type', nullable: true })
  fileType: string;

  @Column({ name: 'raw_text', type: 'text', nullable: true })
  rawText: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'NOW()' })
  uploadedAt: Date;

  @ManyToOne(() => User, (user) => user.cvs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => CvParsed, (cvParsed) => cvParsed.cv)
  parsed: CvParsed;

  @ManyToMany(() => Skill, (skill) => skill.cvs)
  @JoinTable({
    name: 'cv_skills',
    joinColumn: { name: 'cv_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'skill_id', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Application, (application) => application.cv)
  applications: Application[];
}
