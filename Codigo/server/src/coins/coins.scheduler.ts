import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinTransferQueueService } from './coin-transfer-queue.service';
import { CoinsService } from './coins.service';

@Injectable()
export class CoinsScheduler implements OnModuleInit {
  private readonly logger = new Logger(CoinsScheduler.name);

  constructor(
    private readonly coinsService: CoinsService,
    private readonly queueService: CoinTransferQueueService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.runSemesterCredit('startup');
  }

  @Cron('0 5 0 1 * *', { timeZone: 'America/Sao_Paulo' })
  async creditProfessorsEachMonth(): Promise<void> {
    await this.runSemesterCredit('monthly-cron');
  }

  @Cron('0 * * * * *', { timeZone: 'America/Sao_Paulo' })
  async processCoinTransferQueue(): Promise<void> {
    const processed = await this.queueService.consumePendingTransfers();
    if (processed > 0) {
      this.logger.log(
        `[queue] ${processed} mensagem(ns) processada(s) da fila de transferencias.`,
      );
    }
  }

  private async runSemesterCredit(
    origin: 'startup' | 'monthly-cron',
  ): Promise<void> {
    try {
      const credited = await this.coinsService.creditSemesterAllowance();
      if (credited > 0) {
        this.logger.log(
          `[${origin}] ${credited} professor(es) receberam crédito semestral de 1000 moedas.`,
        );
      }
    } catch (error) {
      this.logger.error(
        `[${origin}] Falha ao aplicar crédito semestral de professores.`,
        error,
      );
    }
  }
}
