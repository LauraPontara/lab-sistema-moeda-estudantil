import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../database/schemas';
import { EmailAlreadyInUseException } from '../common/exceptions/email-already-in-use.exception';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { AdministratorModel } from './models/administrator.model';
import { PartnerCompanyModel } from './models/partner-company.model';
import { ProfessorModel } from './models/professor.model';
import { StudentModel } from './models/student.model';
import { UserModel } from './models/user.model';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
    const passwordHash = await this.hashPassword(dto.password);
    const professor = await this.usersRepository.createProfessor(
      dto,
      passwordHash,
    );
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

  async delete(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Usuario nao encontrado.');
    }
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
}
