import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { institutions } from '../database/schemas';
import * as schema from '../database/schemas';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

type Database = PostgresJsDatabase<typeof schema>;

@Injectable()
export class InstitutionsRepository {
  constructor(@Inject(DATABASE_CONNECTION) private readonly db: Database) {}

  findAll() {
    return this.db.select().from(institutions).orderBy(institutions.name);
  }

  async findById(id: string) {
    const [institution] = await this.db
      .select()
      .from(institutions)
      .where(eq(institutions.id, id))
      .limit(1);

    return institution ?? null;
  }

  async create(dto: CreateInstitutionDto) {
    const [institution] = await this.db
      .insert(institutions)
      .values(dto)
      .returning();
    return institution;
  }

  async update(id: string, dto: UpdateInstitutionDto) {
    const [institution] = await this.db
      .update(institutions)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(institutions.id, id))
      .returning();

    return institution ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = await this.db
      .delete(institutions)
      .where(eq(institutions.id, id))
      .returning({ id: institutions.id });

    return deleted.length > 0;
  }
}
