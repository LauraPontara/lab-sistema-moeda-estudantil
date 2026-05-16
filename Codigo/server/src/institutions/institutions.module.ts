import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersRepository } from '../users/repositories/users.repository';
import { InstitutionsController } from './institutions.controller';
import { InstitutionsRepository } from './institutions.repository';
import { InstitutionsService } from './institutions.service';

@Module({
  imports: [DatabaseModule],
  controllers: [InstitutionsController],
  providers: [InstitutionsRepository, InstitutionsService, UsersRepository],
  exports: [InstitutionsService],
})
export class InstitutionsModule {}
