import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.constants';
import * as schema from '../database/schemas';
import { EmailService } from '../email/email.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { RedemptionEvent } from './redemption-event.type';
import { QueueMessageRow } from '../common/queue/queue-message.type';

type Database = PostgresJsDatabase<typeof schema>;

@Injectable()
export class RedemptionQueueService implements OnModuleInit {
  private readonly logger = new Logger(RedemptionQueueService.name);
  private readonly queueName =
    process.env.SUPABASE_QUEUE_NAME_REDEMPTIONS ??
    'advantage_redemption_events';

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Database,
    private readonly emailService: EmailService,
    private readonly whatsappService: WhatsAppService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureQueue();
  }

  async publishRedemption(event: RedemptionEvent): Promise<void> {
    try {
      await this.db.execute(
        sql`select * from pgmq.send(${this.queueName}, ${JSON.stringify(event)}::jsonb)`,
      );
    } catch (error) {
      this.logger.error(
        'Falha ao publicar evento de resgate na fila PGMQ.',
        error,
      );
      await this.sendRedemptionEmails(event);
    }
  }

  async consumePendingRedemptions(
    batchSize = 10,
    visibilityTimeout = 60,
  ): Promise<number> {
    try {
      const result = await this.db.execute(
        sql`select msg_id, message from pgmq.read(${this.queueName}, ${visibilityTimeout}, ${batchSize})`,
      );

      const rows = result as unknown as QueueMessageRow<RedemptionEvent>[];

      if (!rows.length) {
        return 0;
      }

      let processed = 0;

      for (const row of rows) {
        try {
          await this.sendRedemptionEmails(row.message);
          await this.db.execute(
            sql`select * from pgmq.delete(${this.queueName}::text, ${row.msg_id}::bigint)`,
          );
          processed += 1;
        } catch (error) {
          this.logger.error(
            `Falha ao processar mensagem ${row.msg_id} da fila PGMQ.`,
            error,
          );
        }
      }

      return processed;
    } catch (error) {
      this.logger.error('Falha ao consumir mensagens da fila PGMQ.', error);
      return 0;
    }
  }

  private async ensureQueue(): Promise<void> {
    try {
      const result = await this.db.execute(
        sql`select queue_name from pgmq.list_queues() where queue_name = ${this.queueName}`,
      );
      const rows = result as unknown as Array<{ queue_name: string }>;

      if (rows.length === 0) {
        this.logger.warn(
          `Fila ${this.queueName} nao encontrada. Execute as migrations para criar a fila PGMQ.`,
        );
        return;
      }

      this.logger.log(`Fila Supabase PGMQ encontrada: ${this.queueName}.`);
    } catch (error) {
      this.logger.error(
        'Falha ao validar fila Supabase PGMQ. Verifique se a extensao pgmq esta instalada e se as migrations foram aplicadas.',
        error,
      );
    }
  }

  private async sendRedemptionEmails(event: RedemptionEvent): Promise<void> {
    await Promise.all([
      this.emailService.sendRedemptionCouponToStudent({
        to: event.student.email,
        studentName: event.student.name,
        advantageTitle: event.advantage.title,
        companyName: event.company.tradeName,
        couponCode: event.couponCode,
        balanceAfter: event.student.balanceAfter,
      }),
      this.emailService.sendRedemptionNotificationToCompany({
        to: event.company.email,
        companyName: event.company.tradeName,
        studentName: event.student.name,
        advantageTitle: event.advantage.title,
        couponCode: event.couponCode,
      }),
      this.whatsappService.sendRedemptionCouponToStudent({
        phone: event.student.whatsappPhone,
        studentName: event.student.name,
        advantageTitle: event.advantage.title,
        companyName: event.company.tradeName,
        couponCode: event.couponCode,
        balanceAfter: event.student.balanceAfter,
      }),
      this.whatsappService.sendRedemptionNotificationToCompany({
        phone: event.company.whatsappPhone,
        companyName: event.company.tradeName,
        studentName: event.student.name,
        advantageTitle: event.advantage.title,
        couponCode: event.couponCode,
      }),
    ]);
  }
}
