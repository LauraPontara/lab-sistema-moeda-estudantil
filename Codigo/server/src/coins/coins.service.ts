import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '../database/schemas';
import { CoinTransferQueueService } from './coin-transfer-queue.service';
import { CoinsRepository } from './coins.repository';
import { SendCoinsDto } from './dto/send-coins.dto';
import {
  CoinStatementModel,
  SendCoinsResponseModel,
} from './models/coin-statement.model';

function semesterCode(date: Date): string {
  const month = date.getUTCMonth() + 1;
  const semester = month <= 6 ? 1 : 2;
  return `${date.getUTCFullYear()}-${semester}`;
}

@Injectable()
export class CoinsService {
  constructor(
    private readonly coinsRepository: CoinsRepository,
    private readonly queueService: CoinTransferQueueService,
  ) {}

  async sendCoinsByProfessor(
    professorId: string,
    dto: SendCoinsDto,
  ): Promise<SendCoinsResponseModel> {
    const result = await this.coinsRepository.createTransferByProfessor(
      professorId,
      dto,
    );

    if (result.status === 'not_found') {
      throw new NotFoundException('Professor ou aluno não encontrado.');
    }

    if (result.status === 'different_institution') {
      throw new BadRequestException(
        'Professor e aluno precisam pertencer à mesma instituição.',
      );
    }

    if (result.status === 'insufficient_balance') {
      throw new BadRequestException('Saldo insuficiente para enviar moedas.');
    }

    if (!result.event) {
      throw new BadRequestException(
        'Não foi possível registrar a transferência.',
      );
    }

    await this.queueService.publishTransfer(result.event);

    return {
      message: 'Moedas enviadas com sucesso.',
      balance: result.balanceAfter,
    };
  }

  async getMyStatement(
    userId: string,
    role: UserRole,
  ): Promise<CoinStatementModel> {
    if (role === UserRole.PROFESSOR) {
      const statement =
        await this.coinsRepository.getProfessorStatement(userId);
      if (!statement) {
        throw new NotFoundException('Professor não encontrado.');
      }
      return statement;
    }

    if (role === UserRole.STUDENT) {
      const statement = await this.coinsRepository.getStudentStatement(userId);
      if (!statement) {
        throw new NotFoundException('Aluno não encontrado.');
      }
      return statement;
    }

    throw new BadRequestException(
      'Extrato disponível apenas para professores e alunos.',
    );
  }

  async creditSemesterAllowance(date = new Date()): Promise<number> {
    return this.coinsRepository.creditSemesterAllowances(semesterCode(date));
  }
}
