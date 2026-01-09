import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../../entities/user.entity';
import { Job } from '../../entities/job.entity';
import { Application } from '../../entities/application.entity';
import { Company } from '../../entities/company.entity';
import { CandidateProfile } from '../../entities/candidate-profile.entity';
import { Cv } from '../../entities/cv.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Job, Application, Company, CandidateProfile, Cv]),
    ],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
