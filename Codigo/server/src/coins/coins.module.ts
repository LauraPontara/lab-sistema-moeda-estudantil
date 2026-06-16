import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { CoinsController } from './coins.controller';
import { CoinTransferQueueService } from './coin-transfer-queue.service';
import { CoinsRepository } from './coins.repository';
import { CoinsScheduler } from './coins.scheduler';
import { CoinsService } from './coins.service';

@Module({
  imports: [DatabaseModule, EmailModule, WhatsAppModule],
  controllers: [CoinsController],
  providers: [
    CoinsRepository,
    CoinsService,
    CoinTransferQueueService,
    CoinsScheduler,
  ],
})
export class CoinsModule {}
