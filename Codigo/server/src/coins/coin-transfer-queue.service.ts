import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.constants';
import * as schema from '../database/schemas';
import { EmailService } from '../email/email.service';
import { CoinTransferEvent } from './coin-transfer-event.type';

type Database = PostgresJsDatabase<typeof schema>;

type QueueMessageRow = {
  msg_id: number;
  message: CoinTransferEvent;
};

@Injectable()
export class CoinTransferQueueService implements OnModuleInit {
  private readonly logger = new Logger(CoinTransferQueueService.name);
  private readonly queueName =
    process.env.SUPABASE_QUEUE_NAME ?? 'coin_transfer_events';

  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: Database,
    private readonly emailService: EmailService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureQueue();
  }

  async publishTransfer(event: CoinTransferEvent): Promise<void> {
    try {
      await this.db.execute(
        sql`select * from pgmq.send(${this.queueName}, ${JSON.stringify(event)}::jsonb)`,
      );
    } catch (error) {
      this.logger.error(
        'Falha ao publicar evento de transferencia na fila PGMQ.',
        error,
      );
      await this.sendTransferEmails(event);
    }
  }

  async consumePendingTransfers(
    batchSize = 10,
    visibilityTimeout = 60,
  ): Promise<number> {
    try {
      const result = await this.db.execute(
        sql`select msg_id, message from pgmq.read(${this.queueName}, ${visibilityTimeout}, ${batchSize})`,
      );

      const rows = result as unknown as QueueMessageRow[];

      if (!rows.length) {
        return 0;
      }

      let processed = 0;

      for (const row of rows) {
        try {
          await this.sendTransferEmails(row.message);
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

  private async sendTransferEmails(event: CoinTransferEvent): Promise<void> {
    await Promise.all([
      this.emailService.sendCoinsSentConfirmation({
        to: event.professor.email,
        professorName: event.professor.name,
        studentName: event.student.name,
        amount: event.amount,
        reason: event.message,
        balanceAfter: event.professor.balanceAfter,
      }),
      this.emailService.sendCoinsReceivedNotification({
        to: event.student.email,
        studentName: event.student.name,
        professorName: event.professor.name,
        amount: event.amount,
        reason: event.message,
        balanceAfter: event.student.balanceAfter,
      }),
    ]);
  }
}
