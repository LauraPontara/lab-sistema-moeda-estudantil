import * as dotenv from 'dotenv';
dotenv.config();

import * as bcrypt from 'bcrypt';
import { and, eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schemas';
import {
  administratorProfiles,
  advantages,
  institutions,
  partnerCompanyProfiles,
  UserRole,
  users,
} from './schemas';

const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'Senha123!';
const COMPANY_EMAIL = 'empresa@gmail.com';
const COMPANY_PASSWORD = 'Senha123!';
const COMPANY_TRADE_NAME = 'Café da Esquina';

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

  console.log('Seeding demo partner company and advantages...');

  const companyPasswordHash = await bcrypt.hash(COMPANY_PASSWORD, 10);

  const [existingCompany] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, COMPANY_EMAIL))
    .limit(1);

  let companyId = existingCompany?.id;

  if (!companyId) {
    const [companyUser] = await db
      .insert(users)
      .values({
        email: COMPANY_EMAIL,
        passwordHash: companyPasswordHash,
        role: UserRole.PARTNER_COMPANY,
      })
      .returning({ id: users.id });

    companyId = companyUser.id;

    await db.insert(partnerCompanyProfiles).values({
      userId: companyId,
      cnpj: '12.345.678/0001-90',
      tradeName: COMPANY_TRADE_NAME,
      address: 'Rua das Vitórias, 123 - Belo Horizonte/MG',
      contactPhone: '(31) 99999-0000',
    });

    console.log(`Demo company user created: ${COMPANY_EMAIL}`);
  } else {
    const [existingProfile] = await db
      .select({ id: partnerCompanyProfiles.id })
      .from(partnerCompanyProfiles)
      .where(eq(partnerCompanyProfiles.userId, companyId))
      .limit(1);

    if (!existingProfile) {
      await db.insert(partnerCompanyProfiles).values({
        userId: companyId,
        cnpj: '12.345.678/0001-90',
        tradeName: COMPANY_TRADE_NAME,
        address: 'Rua das Vitórias, 123 - Belo Horizonte/MG',
        contactPhone: '(31) 99999-0000',
      });
    }
  }

  const demoAdvantages = [
    {
      title: '10% de desconto no R.U.',
      description:
        'Desconto no restaurante universitário para a próxima compra.',
      category: 'ALIMENTACAO',
      icon: 'utensils',
      costXp: 50,
    },
    {
      title: '5% na mensalidade',
      description: 'Benefício especial para reduzir o valor da mensalidade.',
      category: 'EDUCACAO',
      icon: 'graduation',
      costXp: 800,
    },
    {
      title: 'Caderno do Cuphead',
      description: 'Caderno exclusivo para estudos e anotações do semestre.',
      category: 'MATERIAL',
      icon: 'notebook',
      costXp: 120,
    },
    {
      title: 'Café da manhã grátis',
      description: 'Um café da manhã para começar o dia com energia.',
      category: 'ALIMENTACAO',
      icon: 'coffee',
      costXp: 80,
    },
    {
      title: 'Livro técnico (até R$50)',
      description:
        'Vale para um livro técnico no valor de até cinquenta reais.',
      category: 'MATERIAL',
      icon: 'book',
      costXp: 150,
    },
    {
      title: 'Ingresso cinema vintage',
      description: 'Ingresso para uma sessão especial de cinema retrô.',
      category: 'LAZER',
      icon: 'film',
      costXp: 200,
    },
  ] as const;

  for (const advantage of demoAdvantages) {
    const [existingAdvantage] = await db
      .select({ id: advantages.id })
      .from(advantages)
      .where(
        and(
          eq(advantages.companyId, companyId),
          eq(advantages.title, advantage.title),
        ),
      )
      .limit(1);

    if (!existingAdvantage) {
      await db.insert(advantages).values({
        companyId,
        title: advantage.title,
        description: advantage.description,
        category: advantage.category,
        icon: advantage.icon,
        costXp: advantage.costXp,
      });
    }
  }

  console.log('Demo partner company and advantages seeded successfully.');

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

      await tx.insert(administratorProfiles).values({ userId: adminUser.id });
    });
    console.log(`Admin user created: ${ADMIN_EMAIL}`);
  }

  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
