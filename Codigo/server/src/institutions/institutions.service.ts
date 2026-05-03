import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionsRepository } from './institutions.repository';

@Injectable()
export class InstitutionsService {
  constructor(
    private readonly institutionsRepository: InstitutionsRepository,
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
}
