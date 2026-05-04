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
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreatePartnerCompanyDto } from './dto/create-partner-company.dto';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { AdministratorModel } from './models/administrator.model';
import type { PartnerCompanyModel } from './models/partner-company.model';
import type { ProfessorModel } from './models/professor.model';
import type { StudentModel } from './models/student.model';
import type { UserProfileModel } from './models/user-profile.model';
import type { UserModel } from './models/user.model';
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
  @Get('users/me/profile')
  getMyProfile(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<UserProfileModel> {
    return this.usersService.getProfile(currentUser.sub, currentUser.role);
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
  @Patch('users/me/profile')
  updateProfile(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserProfileModel> {
    return this.usersService.updateProfile(
      currentUser.sub,
      currentUser.role,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/me')
  @HttpCode(204)
  async deleteMe(@CurrentUser() currentUser: JwtPayload): Promise<void> {
    await this.usersService.delete(currentUser.sub);
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
