import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { JwtPayload } from '../auth/jwt-payload.interface';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../database/schemas';
import { AdvantagesService } from './advantages.service';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import type { AdvantageModel } from './models/advantage.model';

@Controller('advantages')
export class AdvantagesController {
  constructor(private readonly advantagesService: AdvantagesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER_COMPANY)
  @Post()
  createAdvantage(
    @CurrentUser() currentUser: JwtPayload,
    @Body() dto: CreateAdvantageDto,
  ): Promise<AdvantageModel> {
    return this.advantagesService.createAdvantage(currentUser.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER_COMPANY)
  @Get('mine')
  listMyAdvantages(
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<AdvantageModel[]> {
    return this.advantagesService.listByCompany(currentUser.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  listCatalog(): Promise<AdvantageModel[]> {
    return this.advantagesService.listCatalog();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STUDENT)
  @Post(':id/redemptions')
  redeemAdvantage(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id') id: string,
  ): Promise<{ message: string; couponCode: string; balance: number }> {
    return this.advantagesService.redeemForStudent(currentUser.sub, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PARTNER_COMPANY)
  @Delete(':id')
  @HttpCode(204)
  deleteAdvantage(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    return this.advantagesService.deleteAdvantage(id, currentUser.sub);
  }
}
