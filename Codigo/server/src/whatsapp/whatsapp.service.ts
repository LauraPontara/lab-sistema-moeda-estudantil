import { Injectable, Logger } from '@nestjs/common';

function formatChatId(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return null;
  // Ensure Brazilian country code prefix
  const normalized = digits.startsWith('55') ? digits : `55${digits}`;
  return `${normalized}@c.us`;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly baseUrl = process.env.WAHA_BASE_URL ?? '';
  private readonly session = process.env.WAHA_SESSION ?? 'default';
  private readonly apiKey = process.env.WAHA_API_KEY ?? '';

  private async sendText(phone: string | null | undefined, text: string): Promise<void> {
    if (!phone || !this.baseUrl) return;

    const chatId = formatChatId(phone);
    if (!chatId) return;

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['X-Api-Key'] = this.apiKey;

    try {
      const res = await fetch(`${this.baseUrl}/api/sendText`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ chatId, text, session: this.session }),
      });

      if (!res.ok) {
        this.logger.error(`WAHA respondeu ${res.status} ao enviar para ${chatId}`);
      }
    } catch (error) {
      this.logger.error(`Falha ao enviar WhatsApp para ${chatId}`, error);
    }
  }

  async sendProfessorWelcome(params: {
    phone: string | null | undefined;
    name: string;
    temporaryPassword: string;
    resetLink: string;
  }): Promise<void> {
    const text = [
      `💰 *Sistema de Moeda Estudantil*`,
      ``,
      `Olá, *${params.name}*! 👋`,
      `Seu cadastro como *professor* foi realizado com sucesso.`,
      ``,
      `🔑 *Senha temporária:* \`${params.temporaryPassword}\``,
      ``,
      `Por segurança, redefina sua senha pelo link abaixo (válido por 24 horas):`,
      params.resetLink,
    ].join('\n');

    await this.sendText(params.phone, text);
  }

  async sendPasswordReset(params: {
    phone: string | null | undefined;
    name: string;
    resetLink: string;
  }): Promise<void> {
    const text = [
      `💰 *Sistema de Moeda Estudantil*`,
      ``,
      `🔑 *Redefinição de senha*`,
      ``,
      `Olá, *${params.name}*!`,
      `Recebemos uma solicitação para redefinir sua senha.`,
      ``,
      `Acesse o link abaixo para criar uma nova senha (válido por 1 hora):`,
      params.resetLink,
      ``,
      `Se você não solicitou isso, ignore esta mensagem.`,
    ].join('\n');

    await this.sendText(params.phone, text);
  }

  async sendCoinsSentConfirmation(params: {
    phone: string | null | undefined;
    professorName: string;
    studentName: string;
    amount: number;
    reason: string;
    balanceAfter: number;
  }): Promise<void> {
    const text = [
      `💰 *Sistema de Moeda Estudantil*`,
      ``,
      `✅ *Envio confirmado!*`,
      ``,
      `Olá, *${params.professorName}*!`,
      `Você enviou *${params.amount} moedas* para *${params.studentName}*.`,
      ``,
      `📝 *Motivo:* ${params.reason}`,
      `💼 *Saldo atual:* ${params.balanceAfter} moedas`,
    ].join('\n');

    await this.sendText(params.phone, text);
  }

  async sendCoinsReceivedNotification(params: {
    phone: string | null | undefined;
    studentName: string;
    professorName: string;
    amount: number;
    reason: string;
    balanceAfter: number;
  }): Promise<void> {
    const text = [
      `💰 *Sistema de Moeda Estudantil*`,
      ``,
      `🎉 *Você recebeu moedas!*`,
      ``,
      `Olá, *${params.studentName}*!`,
      `Você recebeu *${params.amount} moedas* de *${params.professorName}*.`,
      ``,
      `📝 *Mensagem do professor:* ${params.reason}`,
      `💼 *Saldo atual:* ${params.balanceAfter} moedas`,
    ].join('\n');

    await this.sendText(params.phone, text);
  }
}
