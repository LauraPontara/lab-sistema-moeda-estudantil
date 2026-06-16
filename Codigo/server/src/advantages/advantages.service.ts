import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdvantagesRepository } from './advantages.repository';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import { AdvantageModel } from './models/advantage.model';
import { RedemptionQueueService } from './redemption-queue.service';

@Injectable()
export class AdvantagesService {
  constructor(
    private readonly advantagesRepository: AdvantagesRepository,
    private readonly redemptionQueueService: RedemptionQueueService,
  ) {}

  createAdvantage(
    companyId: string,
    dto: CreateAdvantageDto,
  ): Promise<AdvantageModel> {
    return this.advantagesRepository.create(companyId, dto);
  }

  listByCompany(companyId: string): Promise<AdvantageModel[]> {
    return this.advantagesRepository.findByCompany(companyId);
  }

  listCatalog(): Promise<AdvantageModel[]> {
    return this.advantagesRepository.findActiveCatalog();
  }

  async deleteAdvantage(id: string, companyId: string): Promise<void> {
    const deleted = await this.advantagesRepository.softDelete(id, companyId);

    if (!deleted) {
      throw new NotFoundException(
        'Vantagem não encontrada ou você não tem permissão para deletá-la.',
      );
    }
  }

  async redeemForStudent(
    studentId: string,
    advantageId: string,
  ): Promise<{ message: string; couponCode: string; balance: number }> {
    const result = await this.advantagesRepository.redeem(
      studentId,
      advantageId,
    );

    if (result.status === 'not_found') {
      throw new NotFoundException('Aluno não encontrado.');
    }

    if (result.status === 'advantage_unavailable') {
      throw new NotFoundException('Vantagem indisponível.');
    }

    if (result.status === 'insufficient_balance') {
      throw new BadRequestException(
        'Saldo insuficiente para resgatar esta vantagem.',
      );
    }

    if (result.status === 'ok') {
      await this.redemptionQueueService.publishRedemption(result.event);

      return {
        message: 'Resgate realizado com sucesso.',
        couponCode: result.couponCode,
        balance: result.balanceAfter,
      };
    }

    throw new NotFoundException('Vantagem indisponível.');
  }
}
