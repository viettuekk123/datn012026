import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { CandidateProfile } from '../../entities/candidate-profile.entity';
import { Company } from '../../entities/company.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(CandidateProfile)
    private candidateProfileRepository: Repository<CandidateProfile>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) { }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['candidateProfile', 'company'],
    });
  }

  async create(data: { email: string; passwordHash: string; role: UserRole }): Promise<User> {
    const user = this.usersRepository.create(data);
    const savedUser = await this.usersRepository.save(user);

    // Create profile based on role
    if (data.role === UserRole.CANDIDATE) {
      const profile = this.candidateProfileRepository.create({ userId: savedUser.id });
      await this.candidateProfileRepository.save(profile);
    } else if (data.role === UserRole.EMPLOYER) {
      const company = this.companyRepository.create({ userId: savedUser.id, name: '' });
      await this.companyRepository.save(company);
    }

    return savedUser;
  }

  async findAll(page = 1, limit = 10, role?: UserRole) {
    const query = this.usersRepository.createQueryBuilder('user');

    if (role) {
      query.where('user.role = :role', { role });
    }

    const [data, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, isActive: boolean): Promise<User> {
    await this.usersRepository.update(id, { isActive });
    return this.findById(id);
  }

  async getProfile(userId: string) {
    const profile = await this.candidateProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      return { message: 'Profile chưa được tạo' };
    }

    return {
      id: profile.id,
      fullName: profile.fullName,
      phone: profile.phone,
      location: profile.location,
      title: profile.title,
      experienceYears: profile.experienceYears,
      expectedSalary: profile.expectedSalary,
      workType: profile.workType,
      bio: profile.bio,
    };
  }

  async updateProfile(userId: string, updateData: Partial<CandidateProfile>) {
    let profile = await this.candidateProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.candidateProfileRepository.create({ userId, ...updateData });
    } else {
      Object.assign(profile, updateData);
    }

    const saved = await this.candidateProfileRepository.save(profile);

    return {
      message: 'Cập nhật profile thành công',
      profile: {
        id: saved.id,
        fullName: saved.fullName,
        phone: saved.phone,
        location: saved.location,
        title: saved.title,
        experienceYears: saved.experienceYears,
        expectedSalary: saved.expectedSalary,
        workType: saved.workType,
        bio: saved.bio,
      },
    };
  }
}

