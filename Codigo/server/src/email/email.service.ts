import { Injectable, Logger } from '@nestjs/common';

// Design-system color palette (inline for email clients)
const DS = {
  background: '#F9D826', // --background  (yellow)
  surface: '#FAFAFA', // --surface     (near-white)
  border: '#0A0A0A', // --border      (near-black)
  primary: '#E53A1E', // --primary     (red)
  primaryFg: '#FAFAFA', // --primary-foreground
  muted: '#FCEEB5', // --muted       (light yellow)
  mutedFg: '#5C4A38', // --muted-foreground (warm brown)
  foreground: '#0A0A0A', // --foreground
};

function emailWrapper(bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:${DS.background};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${DS.background};padding:40px 16px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:${DS.surface};border:3px solid ${DS.border};border-radius:16px;box-shadow:6px 6px 0 ${DS.border};overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:${DS.primary};border-bottom:3px solid ${DS.border};padding:20px 32px;">
            <span style="font-family:'Arial Black',Arial,sans-serif;font-size:18px;font-weight:900;color:${DS.primaryFg};letter-spacing:-0.5px;">💰 Sistema de Moeda Estudantil</span>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;font-family:Arial,sans-serif;font-size:15px;color:${DS.foreground};line-height:1.6;">
            ${bodyHtml}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:${DS.muted};border-top:3px solid ${DS.border};padding:14px 32px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:${DS.mutedFg};">
              Se você não solicitou esta ação, ignore este email com segurança.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:24px;padding:14px 28px;background:${DS.primary};color:${DS.primaryFg};border:3px solid ${DS.border};border-radius:9999px;box-shadow:4px 4px 0 ${DS.border};text-decoration:none;font-family:'Arial Black',Arial,sans-serif;font-size:13px;font-weight:900;letter-spacing:0.06em;text-transform:uppercase;">${label}</a>`;
}

function codeBlock(value: string): string {
  return `<code style="display:inline-block;background:${DS.muted};border:2px solid ${DS.border};border-radius:6px;padding:4px 10px;font-family:monospace;font-size:14px;font-weight:bold;color:${DS.foreground};">${value}</code>`;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // Envio via API HTTP do Brevo (porta 443). SMTP não funciona no Render free
  // (portas SMTP de saída são bloqueadas), então usamos a API REST.
  private readonly brevoApiKey = process.env.BREVO_API_KEY;
  private readonly senderEmail =
    process.env.BREVO_SENDER_EMAIL || process.env.SMTP_USER;
  private readonly senderName =
    process.env.BREVO_SENDER_NAME || 'Sistema de Moedas';

  /**
   * Envia um email transacional via API do Brevo.
   * Lança em caso de falha — cada chamador decide se trata como melhor-esforço.
   */
  private async sendEmail(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void> {
    if (!this.brevoApiKey) {
      throw new Error('BREVO_API_KEY não configurada');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': this.brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: this.senderName, email: this.senderEmail },
        to: [{ email: params.to }],
        subject: params.subject,
        htmlContent: params.html,
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Brevo API ${response.status}: ${detail}`);
    }
  }

  async sendProfessorWelcome(params: {
    to: string;
    name: string;
    temporaryPassword: string;
    resetToken: string;
  }): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${params.resetToken}`;

    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Olá, ${params.name}! 👋</h2>
      <p style="margin:0 0 12px;">Seu cadastro como <strong>professor</strong> foi realizado no Sistema de Moeda Estudantil.</p>
      <p style="margin:0 0 6px;"><strong>Email de acesso:</strong> ${params.to}</p>
      <p style="margin:0 0 16px;"><strong>Senha temporária:</strong> ${codeBlock(params.temporaryPassword)}</p>
      <p style="margin:0;">Por segurança, redefina sua senha antes de utilizar o sistema. O link expira em <strong>24 horas</strong>:</p>
      ${ctaButton(resetLink, 'Redefinir minha senha')}
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Bem-vindo ao Sistema de Moeda Estudantil 🎓',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de boas-vindas para ${params.to}`,
        error,
      );
      // Não relançar — o professor foi criado com sucesso; o email é melhor-esforço
    }
  }

  async sendPasswordReset(params: {
    to: string;
    name: string;
    resetToken: string;
  }): Promise<void> {
    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha?token=${params.resetToken}`;

    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Redefinição de senha 🔑</h2>
      <p style="margin:0 0 12px;">Olá, <strong>${params.name}</strong>!</p>
      <p style="margin:0 0 12px;">Recebemos uma solicitação para redefinir a senha da sua conta no Sistema de Moeda Estudantil.</p>
      <p style="margin:0 0 4px;">Clique no botão abaixo para criar uma nova senha. O link é válido por <strong>1 hora</strong>:</p>
      ${ctaButton(resetLink, 'Criar nova senha')}
      <p style="margin:24px 0 0;font-size:13px;color:${DS.mutedFg};">Se você não solicitou a redefinição de senha, desconsidere este email — sua senha permanece a mesma.</p>
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Redefinição de senha — Sistema de Moeda Estudantil',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar email de redefinição de senha para ${params.to}`,
        error,
      );
    }
  }

  async sendCoinsSentConfirmation(params: {
    to: string;
    professorName: string;
    studentName: string;
    amount: number;
    reason: string;
    balanceAfter: number;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Envio confirmado ✅</h2>
      <p style="margin:0 0 12px;">Olá, <strong>${params.professorName}</strong>!</p>
      <p style="margin:0 0 12px;">Você enviou <strong>${params.amount} moedas</strong> para <strong>${params.studentName}</strong>.</p>
      <p style="margin:0 0 12px;"><strong>Motivo informado:</strong> ${params.reason}</p>
      <p style="margin:0;"><strong>Seu saldo atual:</strong> ${codeBlock(String(params.balanceAfter))} moedas</p>
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Confirmação de envio de moedas',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar confirmação de envio para ${params.to}`,
        error,
      );
    }
  }

  async sendCoinsReceivedNotification(params: {
    to: string;
    studentName: string;
    professorName: string;
    amount: number;
    reason: string;
    balanceAfter: number;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Você recebeu moedas 🎉</h2>
      <p style="margin:0 0 12px;">Olá, <strong>${params.studentName}</strong>!</p>
      <p style="margin:0 0 12px;">Você recebeu <strong>${params.amount} moedas</strong> de <strong>${params.professorName}</strong>.</p>
      <p style="margin:0 0 12px;"><strong>Mensagem do professor:</strong> ${params.reason}</p>
      <p style="margin:0;"><strong>Seu saldo atual:</strong> ${codeBlock(String(params.balanceAfter))} moedas</p>
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Você recebeu moedas no Sistema de Moeda Estudantil',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar notificação de recebimento para ${params.to}`,
        error,
      );
    }
  }

  async sendRedemptionCouponToStudent(params: {
    to: string;
    studentName: string;
    advantageTitle: string;
    companyName: string;
    couponCode: string;
    balanceAfter: number;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Cupom de resgate 🎟️</h2>
      <p style="margin:0 0 12px;">Olá, <strong>${params.studentName}</strong>!</p>
      <p style="margin:0 0 12px;">Seu resgate de <strong>${params.advantageTitle}</strong> foi confirmado com a empresa <strong>${params.companyName}</strong>.</p>
      <p style="margin:0 0 12px;"><strong>Cupom:</strong> ${codeBlock(params.couponCode)}</p>
      <p style="margin:0;"><strong>Seu saldo atual:</strong> ${codeBlock(String(params.balanceAfter))} XP</p>
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Seu cupom de resgate no Sistema de Moeda Estudantil',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar cupom de resgate para ${params.to}`,
        error,
      );
    }
  }

  async sendRedemptionNotificationToCompany(params: {
    to: string;
    companyName: string;
    studentName: string;
    advantageTitle: string;
    couponCode: string;
  }): Promise<void> {
    const body = `
      <h2 style="margin:0 0 16px;font-family:'Arial Black',Arial,sans-serif;font-size:22px;font-weight:900;">Resgate realizado ✅</h2>
      <p style="margin:0 0 12px;">Olá, <strong>${params.companyName}</strong>!</p>
      <p style="margin:0 0 12px;">O aluno <strong>${params.studentName}</strong> resgatou a vantagem <strong>${params.advantageTitle}</strong>.</p>
      <p style="margin:0;">Cupom gerado: ${codeBlock(params.couponCode)}</p>
    `;

    try {
      await this.sendEmail({
        to: params.to,
        subject: 'Nova confirmação de resgate no Sistema de Moeda Estudantil',
        html: emailWrapper(body),
      });
    } catch (error) {
      this.logger.error(
        `Falha ao enviar notificação de resgate para ${params.to}`,
        error,
      );
    }
  }
}
