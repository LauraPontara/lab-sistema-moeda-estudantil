import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InvalidCredentialsException } from '../common/exceptions/invalid-credentials.exception';
import { EmailService } from '../email/email.service';
import { UserMapper } from '../users/mappers/user.mapper';
import { UsersService } from '../users/users.service';
import { UserRole } from '../database/schemas';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findAuthenticatedByEmail(dto.email);

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const passwordMatches = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: UserMapper.toModel(user),
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    let payload: { sub: string; purpose: string };

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.RESET_PASSWORD_SECRET,
      });
    } catch {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    if (payload.purpose !== 'password-reset') {
      throw new BadRequestException('Token inválido.');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(payload.sub, hashed);

    return { message: 'Senha redefinida com sucesso.' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const GENERIC_MSG =
      'Se este email estiver cadastrado, você receberá um link para redefinir sua senha em breve.';

    const user = await this.usersService.findAuthenticatedByEmail(email);

    // Don't reveal whether the email exists; silently skip if not found or is admin
    if (!user || user.role === UserRole.ADMIN) {
      return { message: GENERIC_MSG };
    }

    const resetToken = this.jwtService.sign(
      { sub: user.id, purpose: 'password-reset' },
      { expiresIn: '1h', secret: process.env.RESET_PASSWORD_SECRET },
    );

    void this.emailService.sendPasswordReset({
      to: user.email,
      name: user.email,
      resetToken,
    });

    return { message: GENERIC_MSG };
  }
}
