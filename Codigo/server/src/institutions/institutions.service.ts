import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';
import { InstitutionsRepository } from './institutions.repository';
import { UsersRepository } from '../users/repositories/users.repository';

@Injectable()
export class InstitutionsService {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  findAll() {
    return this.institutionsRepository.findAll();
  }

  async findById(id: string) {
    const institution = await this.institutionsRepository.findById(id);

    if (!institution) {
      throw new NotFoundException('Instituicao nao encontrada.');
    }

    return institution;
  }

  create(dto: CreateInstitutionDto) {
    return this.institutionsRepository.create(dto);
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    const institution = await this.institutionsRepository.update(id, dto);

    if (!institution) {
      throw new NotFoundException('Instituicao nao encontrada.');
    }

    return institution;
  }

  async delete(id: string): Promise<void> {
    const linkedUsers = await this.usersRepository.countByInstitutionId(id);

    if (linkedUsers > 0) {
      throw new ConflictException(
        'Não é possível excluir uma instituição com professores ou alunos vinculados.',
      );
    }

    const deleted = await this.institutionsRepository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Instituicao nao encontrada.');
    }
  }
}
