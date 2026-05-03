import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AdministratorModel } from './models/administrator.model';
import { PartnerCompanyModel } from './models/partner-company.model';
import { ProfessorModel } from './models/professor.model';
import { StudentModel } from './models/student.model';
import { UserModel } from './models/user.model';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  findAll(): Promise<UserModel[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/:id')
  findById(@Param('id') id: string): Promise<UserModel> {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.usersService.delete(id);
  }

  @Post('students')
  createStudent(@Body() dto: CreateStudentDto): Promise<StudentModel> {
    return this.usersService.createStudent(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  findStudents(): Promise<StudentModel[]> {
    return this.usersService.findStudents();
  }

  @Post('partner-companies')
  createPartnerCompany(
    @Body() dto: CreatePartnerCompanyDto,
  ): Promise<PartnerCompanyModel> {
    return this.usersService.createPartnerCompany(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('partner-companies')
  findPartnerCompanies(): Promise<PartnerCompanyModel[]> {
    return this.usersService.findPartnerCompanies();
  }

  @UseGuards(JwtAuthGuard)
  @Post('professors')
  createProfessor(@Body() dto: CreateProfessorDto): Promise<ProfessorModel> {
    return this.usersService.createProfessor(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('professors')
  findProfessors(): Promise<ProfessorModel[]> {
    return this.usersService.findProfessors();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admins')
  createAdmin(@Body() dto: CreateAdminDto): Promise<AdministratorModel> {
    return this.usersService.createAdmin(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admins')
  findAdmins(): Promise<AdministratorModel[]> {
    return this.usersService.findAdministrators();
  }
}
