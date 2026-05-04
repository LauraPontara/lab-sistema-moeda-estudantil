import * as dotenv from 'dotenv';
dotenv.config();

import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schemas';
import { institutions } from './schemas';

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
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
