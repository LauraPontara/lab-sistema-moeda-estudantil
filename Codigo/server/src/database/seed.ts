import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import * as schema from './schemas';
import { institutions, users, administratorProfiles, UserRole } from './schemas';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Senha123!';

const INSTITUTIONS = [
  { name: 'PUC Minas - Pontifícia Universidade Católica de Minas Gerais' },
  { name: 'UFMG - Universidade Federal de Minas Gerais' },
  { name: 'UFOP - Universidade Federal de Ouro Preto' },
  { name: 'UFSJ - Universidade Federal de São João del-Rei' },
  { name: 'CEFET-MG - Centro Federal de Educação Tecnológica' },
  { name: 'Centro Universitário UNA' },
  { name: 'Newton Paiva - Centro Universitário' },
  { name: 'FUMEC - Universidade FUMEC' },
  { name: 'USP - Universidade de São Paulo' },
  { name: 'UNICAMP - Universidade Estadual de Campinas' },
  { name: 'UFRJ - Universidade Federal do Rio de Janeiro' },
  { name: 'UFF - Universidade Federal Fluminense' },
  { name: 'PUC-SP - Pontifícia Universidade Católica de São Paulo' },
  { name: 'UFPR - Universidade Federal do Paraná' },
  { name: 'UFSC - Universidade Federal de Santa Catarina' },
];

async function seed() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined in .env');
  }

  const client = postgres(databaseUrl, { prepare: false });
  const db = drizzle(client, { schema });

  console.log('Seeding institutions...');

  for (const inst of INSTITUTIONS) {
    await db.insert(institutions).values(inst).onConflictDoNothing();
  }

  console.log(`Seeded ${INSTITUTIONS.length} institutions successfully.`);

  console.log('Seeding admin user...');

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const [existingAdmin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, ADMIN_EMAIL))
    .limit(1);

  if (existingAdmin) {
    console.log(`Admin already exists (${ADMIN_EMAIL}), skipping.`);
  } else {
    await db.transaction(async (tx) => {
      const [adminUser] = await tx
        .insert(users)
        .values({
          email: ADMIN_EMAIL,
          passwordHash,
          role: UserRole.ADMIN,
        })
        .returning();

      await tx
        .insert(administratorProfiles)
        .values({ userId: adminUser.id });
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
