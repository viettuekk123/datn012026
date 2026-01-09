import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { ProfileController } from './profile.controller';
import { User } from '../../entities/user.entity';
import { CandidateProfile } from '../../entities/candidate-profile.entity';
import { Company } from '../../entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CandidateProfile, Company])],
  controllers: [ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }

