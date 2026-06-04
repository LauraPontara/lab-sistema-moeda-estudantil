import { AuthenticatedUser, UserModel } from '../models/user.model';
import { AdministratorModel } from '../models/administrator.model';
import { PartnerCompanyModel } from '../models/partner-company.model';
import { ProfessorModel } from '../models/professor.model';
import { StudentModel } from '../models/student.model';
import { UserProfileModel } from '../models/user-profile.model';

type UserWithStudentProfile = {
  user: AuthenticatedUser;
  profile: {
    name: string;
    cpf: string;
    rg: string;
    address: string;
    cep: string;
    course: string;
    institutionId: string;
  };
};

type UserWithPartnerCompanyProfile = {
  user: AuthenticatedUser;
  profile: {
    cnpj: string;
    tradeName: string;
    address: string;
    contactPhone: string | null;
  };
};

type UserWithProfessorProfile = {
  user: AuthenticatedUser;
  profile: {
    name: string;
    cpf: string;
    department: string;
    institutionId: string;
  };
};

type UserWithAdministratorProfile = {
  user: AuthenticatedUser;
  profile: {
    id: string;
  };
};

export class UserMapper {
  static toModel(user: AuthenticatedUser): UserModel {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      coinBalance: user.coinBalance,
      whatsappPhone: user.whatsappPhone ?? null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toStudentModel(row: UserWithStudentProfile): StudentModel {
    return {
      ...this.toModel(row.user),
      name: row.profile.name,
      cpf: row.profile.cpf,
      rg: row.profile.rg,
      address: row.profile.address,
      cep: row.profile.cep,
      course: row.profile.course,
      institutionId: row.profile.institutionId,
    };
  }

  static toPartnerCompanyModel(
    row: UserWithPartnerCompanyProfile,
  ): PartnerCompanyModel {
    return {
      ...this.toModel(row.user),
      cnpj: row.profile.cnpj,
      tradeName: row.profile.tradeName,
      address: row.profile.address,
      contactPhone: row.profile.contactPhone,
    };
  }

  static toProfessorModel(row: UserWithProfessorProfile): ProfessorModel {
    return {
      ...this.toModel(row.user),
      name: row.profile.name,
      cpf: row.profile.cpf,
      department: row.profile.department,
      institutionId: row.profile.institutionId,
    };
  }

  static toAdministratorModel(
    row: UserWithAdministratorProfile,
  ): AdministratorModel {
    return {
      ...this.toModel(row.user),
      administratorProfileId: row.profile.id,
    };
  }

  static toStudentProfileModel(row: UserWithStudentProfile): UserProfileModel {
    return {
      ...this.toModel(row.user),
      displayName: row.profile.name,
      document: row.profile.cpf,
      documentType: 'CPF',
      rg: row.profile.rg,
      address: row.profile.address,
      cep: row.profile.cep,
      course: row.profile.course,
      institutionId: row.profile.institutionId,
    };
  }

  static toPartnerCompanyProfileModel(
    row: UserWithPartnerCompanyProfile,
  ): UserProfileModel {
    return {
      ...this.toModel(row.user),
      displayName: row.profile.tradeName,
      document: row.profile.cnpj,
      documentType: 'CNPJ',
      address: row.profile.address,
      contactPhone: row.profile.contactPhone,
    };
  }

  static toProfessorProfileModel(
    row: UserWithProfessorProfile,
  ): UserProfileModel {
    return {
      ...this.toModel(row.user),
      displayName: row.profile.name,
      document: row.profile.cpf,
      documentType: 'CPF',
      department: row.profile.department,
      institutionId: row.profile.institutionId,
    };
  }
}
