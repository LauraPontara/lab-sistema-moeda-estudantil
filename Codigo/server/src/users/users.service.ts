import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../database/schemas';
import { EmailAlreadyInUseException } from '../common/exceptions/email-already-in-use.exception';
import { generateTemporaryPassword } from '../common/utils/password.util';
import { EmailService } from '../email/email.service';
import { InstitutionsService } from '../institutions/institutions.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { AdministratorModel } from './models/administrator.model';
import { PartnerCompanyModel } from './models/partner-company.model';
import { ProfessorModel } from './models/professor.model';
import { StudentModel } from './models/student.model';
import { UserProfileModel } from './models/user-profile.model';
import { UserModel } from './models/user.model';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly institutionsService: InstitutionsService,
  ) {}

  async findAll(role?: UserRole): Promise<UserModel[]> {
    const users = await this.usersRepository.findAll(role);
    return users.map((user) => UserMapper.toModel(user));
  }

  async findById(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return UserMapper.toModel(user);
  }

  async findStudents(): Promise<StudentModel[]> {
    const students = await this.usersRepository.findStudents();
    return students.map((student) => UserMapper.toStudentModel(student));
  }

  async findPartnerCompanies(): Promise<PartnerCompanyModel[]> {
    const partnerCompanies = await this.usersRepository.findPartnerCompanies();
    return partnerCompanies.map((partnerCompany) =>
      UserMapper.toPartnerCompanyModel(partnerCompany),
    );
  }

  async findProfessors(): Promise<ProfessorModel[]> {
    const professors = await this.usersRepository.findProfessors();
    return professors.map((professor) =>
      UserMapper.toProfessorModel(professor),
    );
  }

  async findAdministrators(): Promise<AdministratorModel[]> {
    const administrators = await this.usersRepository.findAdministrators();
    return administrators.map((administrator) =>
      UserMapper.toAdministratorModel(administrator),
    );
  }

  async findAuthenticatedByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async createStudent(dto: CreateStudentDto): Promise<StudentModel> {
    await this.ensureEmailIsAvailable(dto.email);
    const passwordHash = await this.hashPassword(dto.password);
    const student = await this.usersRepository.createStudent(dto, passwordHash);
    return UserMapper.toStudentModel(student);
  }

  async createPartnerCompany(
    dto: CreatePartnerCompanyDto,
  ): Promise<PartnerCompanyModel> {
    await this.ensureEmailIsAvailable(dto.email);
    const passwordHash = await this.hashPassword(dto.password);
    const partnerCompany = await this.usersRepository.createPartnerCompany(
      dto,
      passwordHash,
    );
    return UserMapper.toPartnerCompanyModel(partnerCompany);
  }

  async createProfessor(dto: CreateProfessorDto): Promise<ProfessorModel> {
    await this.ensureEmailIsAvailable(dto.email);
    await this.institutionsService.findById(dto.institutionId);

    const temporaryPassword = generateTemporaryPassword();
    const passwordHash = await this.hashPassword(temporaryPassword);

    const professor = await this.usersRepository.createProfessor(
      dto,
      passwordHash,
    );

    const resetToken = this.jwtService.sign(
      { sub: professor.user.id, purpose: 'password-reset' },
      { expiresIn: '24h', secret: process.env.RESET_PASSWORD_SECRET },
    );

    void this.emailService.sendProfessorWelcome({
      to: dto.email,
      name: dto.name,
      temporaryPassword,
      resetToken,
    });

    return UserMapper.toProfessorModel(professor);
  }

  async createAdmin(dto: CreateAdminDto): Promise<AdministratorModel> {
    await this.ensureEmailIsAvailable(dto.email);
    const passwordHash = await this.hashPassword(dto.password);
    const administrator = await this.usersRepository.createAdmin(
      dto,
      passwordHash,
    );
    return UserMapper.toAdministratorModel(administrator);
  }

  async update(id: string, dto: UpdateUserDto): Promise<UserModel> {
    if (dto.email) {
      await this.ensureEmailIsAvailable(dto.email, id);
    }

    const user = await this.usersRepository.update(id, dto);

    if (!user) {
      throw new NotFoundException('Usuario nao encontrado.');
    }

    return UserMapper.toModel(user);
  }

  async updateProfile(
    userId: string,
    role: UserRole,
    dto: UpdateProfileDto,
  ): Promise<UserProfileModel> {
    if (dto.document) {
      this.ensureDocumentMatchesRole(role, dto.document);
    }

    switch (role) {
      case UserRole.STUDENT: {
        const student = await this.usersRepository.updateStudentProfile(
          userId,
          dto,
        );

        if (!student) {
          throw new NotFoundException('Aluno nao encontrado.');
        }

        return UserMapper.toStudentProfileModel(student);
      }
      case UserRole.PROFESSOR: {
        const professor = await this.usersRepository.updateProfessorProfile(
          userId,
          dto,
        );

        if (!professor) {
          throw new NotFoundException('Professor nao encontrado.');
        }

        return UserMapper.toProfessorProfileModel(professor);
      }
      case UserRole.PARTNER_COMPANY: {
        const partnerCompany =
          await this.usersRepository.updatePartnerCompanyProfile(userId, dto);

        if (!partnerCompany) {
          throw new NotFoundException('Empresa parceira nao encontrada.');
        }

        return UserMapper.toPartnerCompanyProfileModel(partnerCompany);
      }
      case UserRole.ADMIN:
      default: {
        throw new BadRequestException('Perfil sem dados editaveis.');
      }
    }
  }

  async getProfile(
    userId: string,
    role: UserRole,
  ): Promise<UserProfileModel> {
    switch (role) {
      case UserRole.STUDENT: {
        const student = await this.usersRepository.findStudentByUserId(userId);
        if (!student) throw new NotFoundException('Aluno nao encontrado.');
        return UserMapper.toStudentProfileModel(student);
      }
      case UserRole.PARTNER_COMPANY: {
        const partnerCompany =
          await this.usersRepository.findPartnerCompanyByUserId(userId);
        if (!partnerCompany)
          throw new NotFoundException('Empresa parceira nao encontrada.');
        return UserMapper.toPartnerCompanyProfileModel(partnerCompany);
      }
      case UserRole.PROFESSOR: {
        const professor =
          await this.usersRepository.findProfessorByUserId(userId);
        if (!professor)
          throw new NotFoundException('Professor nao encontrado.');
        return UserMapper.toProfessorProfileModel(professor);
      }
      case UserRole.ADMIN:
      default:
        throw new BadRequestException('Perfil sem dados extras.');
    }
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Usuario nao encontrado.');
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.usersRepository.updatePassword(userId, hashedPassword);
  }

  async updateProfessorByAdmin(
    professorUserId: string,
    dto: UpdateProfileDto,
  ): Promise<ProfessorModel> {
    const professor = await this.usersRepository.updateProfessorProfile(
      professorUserId,
      dto,
    );

    if (!professor) {
      throw new NotFoundException('Professor nao encontrado.');
    }

    return UserMapper.toProfessorModel(professor);
  }

  private async ensureEmailIsAvailable(
    email: string,
    ignoredUserId?: string,
  ): Promise<void> {
    const exists = await this.usersRepository.existsByEmail(
      email,
      ignoredUserId,
    );

    if (exists) {
      throw new EmailAlreadyInUseException();
    }
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private ensureDocumentMatchesRole(role: UserRole, document: string): void {
    const cpfRegex = /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    const cnpjRegex = /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

    if (
      (role === UserRole.STUDENT || role === UserRole.PROFESSOR) &&
      !cpfRegex.test(document)
    ) {
      throw new BadRequestException('CPF invalido para este perfil.');
    }

    if (role === UserRole.PARTNER_COMPANY && !cnpjRegex.test(document)) {
      throw new BadRequestException('CNPJ invalido para este perfil.');
    }
  }
}
