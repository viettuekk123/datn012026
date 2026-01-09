import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cv } from '../../entities/cv.entity';
import { CvParsed } from '../../entities/cv-parsed.entity';
import { SkillsService } from '../skills/skills.service';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv)
    private cvRepository: Repository<Cv>,
    @InjectRepository(CvParsed)
    private cvParsedRepository: Repository<CvParsed>,
    private skillsService: SkillsService,
    private configService: ConfigService,
  ) {}

  async upload(userId: string, file: Express.Multer.File) {
    // Save file
    const uploadDir = path.join(process.cwd(), 'uploads', 'cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // Determine file type
    const ext = path.extname(file.originalname).toLowerCase();
    let fileType = 'pdf';
    if (['.doc', '.docx'].includes(ext)) fileType = 'docx';
    if (['.png', '.jpg', '.jpeg'].includes(ext)) fileType = 'image';

    // Create CV record
    const cv = this.cvRepository.create({
      userId,
      filename: file.originalname,
      fileUrl: `/uploads/cvs/${filename}`,
      fileType,
    });

    // Set as default if first CV
    const existingCvs = await this.cvRepository.count({ where: { userId } });
    if (existingCvs === 0) {
      cv.isDefault = true;
    }

    const savedCv = await this.cvRepository.save(cv);

    // Call NER service to parse CV
    const parsedData = await this.parseWithNer(filePath);

    // Save parsed data
    const cvParsed = this.cvParsedRepository.create({
      cvId: savedCv.id,
      ...parsedData,
    });
    await this.cvParsedRepository.save(cvParsed);

    // Map skills
    if (parsedData.skills?.length) {
      const skills = await this.skillsService.findOrCreate(parsedData.skills);
      savedCv.skills = skills;
      await this.cvRepository.save(savedCv);
    }

    return {
      message: 'Upload và parse CV thành công',
      cv: {
        id: savedCv.id,
        filename: savedCv.filename,
        fileUrl: savedCv.fileUrl,
        parsed: cvParsed,
      },
    };
  }

  private async parseWithNer(filePath: string): Promise<any> {
    const nerUrl = this.configService.get('NER_SERVICE_URL');

    try {
      const FormData = (await import('form-data')).default;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath));

      const response = await fetch(`${nerUrl}/extract`, {
        method: 'POST',
        body: formData as any,
      });

      if (!response.ok) {
        throw new Error('NER service error');
      }

      const result = await response.json();
      return {
        name: result.data?.name?.[0] || null,
        email: result.data?.email?.[0] || null,
        phone: result.data?.phone?.[0] || null,
        location: result.data?.location?.[0] || null,
        positions: result.data?.position || [],
        organizations: result.data?.organization || [],
        skills: result.data?.skills || [],
        degrees: result.data?.education?.degrees || [],
        schools: result.data?.education?.schools || [],
      };
    } catch (error) {
      console.error('NER service error:', error);
      // Return empty parsed data if NER fails
      return {
        name: null,
        email: null,
        phone: null,
        location: null,
        positions: [],
        organizations: [],
        skills: [],
        degrees: [],
        schools: [],
      };
    }
  }

  async findByUser(userId: string) {
    const cvs = await this.cvRepository.find({
      where: { userId },
      relations: ['parsed', 'skills'],
      order: { uploadedAt: 'DESC' },
    });

    return {
      data: cvs.map((cv) => ({
        ...cv,
        skills: cv.skills?.map((s) => s.name) || [],
      })),
    };
  }

  async findById(id: string, userId?: string): Promise<Cv> {
    const cv = await this.cvRepository.findOne({
      where: { id },
      relations: ['parsed', 'skills'],
    });

    if (!cv) {
      throw new NotFoundException('CV không tồn tại');
    }

    if (userId && cv.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xem CV này');
    }

    return cv;
  }

  async setDefault(userId: string, id: string): Promise<Cv> {
    const cv = await this.findById(id, userId);

    // Remove default from other CVs
    await this.cvRepository.update({ userId }, { isDefault: false });

    // Set this CV as default
    cv.isDefault = true;
    return this.cvRepository.save(cv);
  }

  async delete(userId: string, id: string): Promise<void> {
    const cv = await this.findById(id, userId);
    await this.cvRepository.remove(cv);
  }

  async getDefaultCv(userId: string): Promise<Cv | null> {
    return this.cvRepository.findOne({
      where: { userId, isDefault: true },
      relations: ['skills'],
    });
  }
}
