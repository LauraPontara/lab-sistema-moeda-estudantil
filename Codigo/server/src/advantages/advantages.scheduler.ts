import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedemptionQueueService } from './redemption-queue.service';

@Injectable()
export class AdvantagesScheduler implements OnModuleInit {
  private readonly logger = new Logger(AdvantagesScheduler.name);

  constructor(private readonly queueService: RedemptionQueueService) {}

  async onModuleInit(): Promise<void> {
    await this.processRedemptionQueue();
  }

  @Cron('0 * * * * *', { timeZone: 'America/Sao_Paulo' })
  async processRedemptionQueue(): Promise<void> {
    const processed = await this.queueService.consumePendingRedemptions();

    if (processed > 0) {
      this.logger.log(
        `[queue] ${processed} mensagem(ns) processada(s) da fila de resgates.`,
      );
    }
  }
}
