import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { AdvantagesController } from './advantages.controller';
import { AdvantagesRepository } from './advantages.repository';
import { AdvantagesScheduler } from './advantages.scheduler';
import { AdvantagesService } from './advantages.service';
import { RedemptionQueueService } from './redemption-queue.service';

@Module({
  imports: [DatabaseModule, EmailModule, WhatsAppModule],
  controllers: [AdvantagesController],
  providers: [
    AdvantagesRepository,
    AdvantagesService,
    RedemptionQueueService,
    AdvantagesScheduler,
  ],
})
export class AdvantagesModule {}
