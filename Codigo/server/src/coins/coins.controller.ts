import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../database/schemas';
import { SendCoinsDto } from './dto/send-coins.dto';
import type {
  CoinStatementModel,
  SendCoinsResponseModel,
} from './models/coin-statement.model';
import { CoinsService } from './coins.service';

@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROFESSOR)
  @Post('transfers')
  sendCoins(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: SendCoinsDto,
  ): Promise<SendCoinsResponseModel> {
    return this.coinsService.sendCoinsByProfessor(currentUser.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statement/me')
  getMyStatement(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<CoinStatementModel> {
    return this.coinsService.getMyStatement(currentUser.sub, currentUser.role);
  }
}
