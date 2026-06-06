import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DATABASE_CONNECTION } from './../src/database/database.constants';
import * as schema from './../src/database/schemas';
import { advantages, institutions, users } from './../src/database/schemas';
import { EmailService } from './../src/email/email.service';

jest.setTimeout(60000);

type Database = PostgresJsDatabase<typeof schema>;

const COMPANY_EMAIL = 'empresa@gmail.com';
const COMPANY_PASSWORD = 'Senha123!';

const emailMock = {
  sendProfessorWelcome: jest.fn(),
  sendPasswordReset: jest.fn(),
  sendCoinsSentConfirmation: jest.fn(),
  sendCoinsReceivedNotification: jest.fn(),
  sendRedemptionCouponToStudent: jest.fn(),
  sendRedemptionNotificationToCompany: jest.fn(),
};

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

interface AuthBody {
  accessToken: string;
  user: { id: string };
}
interface AdvantageBody {
  id: string;
  companyName: string;
}
interface RedeemBody {
  couponCode: string;
  balance: number;
}
interface StatementEntry {
  id: string;
  amount: number;
  direction: 'IN' | 'OUT';
  counterpartName: string;
  message: string;
}
interface StatementBody {
  balance: number;
  entries: StatementEntry[];
}

describe('Advantages (e2e)', () => {
  let app: INestApplication<App>;
  let db: Database;
  let http: App;

  let companyToken: string;
  let studentToken: string;
  let studentId: string;

  const createdAdvantageIds: string[] = [];

  async function login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; id: string }> {
    const res = await request(http)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);
    const body = res.body as AuthBody;
    return { accessToken: body.accessToken, id: body.user.id };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailService)
      .useValue(emailMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    http = app.getHttpServer();
    db = app.get<Database>(DATABASE_CONNECTION);

    const company = await login(COMPANY_EMAIL, COMPANY_PASSWORD);
    companyToken = company.accessToken;

    const [institution] = await db
      .select({ id: institutions.id })
      .from(institutions)
      .limit(1);
    if (!institution) {
      throw new Error('Nenhuma instituição encontrada — rode o seed antes.');
    }

    const studentEmail = `e2e-student-${Date.now()}@example.com`;
    const studentPassword = 'Senha123!';
    const createRes = await request(http)
      .post('/api/students')
      .send({
        name: 'Aluno E2E',
        email: studentEmail,
        password: studentPassword,
        cpf: randomDigits(11),
        rg: `e2e-${randomDigits(7)}`,
        address: 'Rua dos Testes, 123',
        cep: '30000000',
        institutionId: institution.id,
        course: 'Engenharia de Software',
      })
      .expect(201);
    studentId = (createRes.body as { id: string }).id;

    // Crédito de saldo direto no banco (não há rota pública para isso).
    await db
      .update(users)
      .set({ coinBalance: 1000 })
      .where(eq(users.id, studentId));

    const student = await login(studentEmail, studentPassword);
    studentToken = student.accessToken;
  });

  afterAll(async () => {
    // Apaga o aluno primeiro: cascata remove perfil e advantage_redemptions.
    if (studentId) {
      await db.delete(users).where(eq(users.id, studentId));
    }
    // Agora as vantagens criadas no teste podem ser removidas (sem FK pendente).
    for (const id of createdAdvantageIds) {
      await db.delete(advantages).where(eq(advantages.id, id));
    }
    await app.close();
  });

  describe('US05 — gerenciamento pela empresa', () => {
    it('cria, lista, aparece no catálogo e exclui (soft) uma vantagem', async () => {
      const createRes = await request(http)
        .post('/api/advantages')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          title: 'Vantagem E2E US05',
          description: 'Vantagem criada pelo teste e2e de US05.',
          category: 'OUTROS',
          icon: 'gift',
          costXp: 30,
        })
        .expect(201);

      const created = createRes.body as AdvantageBody;
      const advantageId: string = created.id;
      createdAdvantageIds.push(advantageId);
      expect(created.companyName).toBeTruthy();

      const mineRes = await request(http)
        .get('/api/advantages/mine')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200);
      expect(
        (mineRes.body as Array<{ id: string }>).some(
          (a) => a.id === advantageId,
        ),
      ).toBe(true);

      const catalogRes = await request(http)
        .get('/api/advantages')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200);
      expect(
        (catalogRes.body as Array<{ id: string }>).some(
          (a) => a.id === advantageId,
        ),
      ).toBe(true);

      await request(http)
        .delete(`/api/advantages/${advantageId}`)
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(204);

      const afterDelete = await request(http)
        .get('/api/advantages')
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(200);
      expect(
        (afterDelete.body as Array<{ id: string }>).some(
          (a) => a.id === advantageId,
        ),
      ).toBe(false);
    });
  });

  describe('US06 — resgate pelo aluno', () => {
    let redeemableId: string;

    beforeAll(async () => {
      const res = await request(http)
        .post('/api/advantages')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          title: 'Vantagem E2E Resgatável',
          description: 'Vantagem barata para o aluno resgatar no teste.',
          category: 'ALIMENTACAO',
          icon: 'coffee',
          costXp: 50,
        })
        .expect(201);
      redeemableId = (res.body as { id: string }).id;
      createdAdvantageIds.push(redeemableId);
    });

    it('resgata, recebe cupom e debita o saldo (confirmado no extrato)', async () => {
      const redeemRes = await request(http)
        .post(`/api/advantages/${redeemableId}/redemptions`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(201);

      const redeem = redeemRes.body as RedeemBody;
      expect(redeem.couponCode).toMatch(/^[0-9A-F]{12}$/);
      expect(redeem.balance).toBe(950);

      const statementRes = await request(http)
        .get('/api/coins/statement/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);
      const statement = statementRes.body as StatementBody;
      expect(statement.balance).toBe(950);

      const redemptionEntry = statement.entries.find(
        (e) => e.direction === 'OUT' && e.amount === 50,
      );
      expect(redemptionEntry).toBeDefined();
      expect(redemptionEntry?.counterpartName).toBeTruthy();
    });

    it('rejeita resgate quando o saldo é insuficiente (sem débito)', async () => {
      const expensiveRes = await request(http)
        .post('/api/advantages')
        .set('Authorization', `Bearer ${companyToken}`)
        .send({
          title: 'Vantagem E2E Cara',
          description: 'Custo acima do saldo do aluno de teste.',
          category: 'EDUCACAO',
          icon: 'graduation',
          costXp: 100000,
        })
        .expect(201);
      const expensiveId: string = (expensiveRes.body as { id: string }).id;
      createdAdvantageIds.push(expensiveId);

      await request(http)
        .post(`/api/advantages/${expensiveId}/redemptions`)
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(400);

      const statementRes = await request(http)
        .get('/api/coins/statement/me')
        .set('Authorization', `Bearer ${studentToken}`)
        .expect(200);
      expect((statementRes.body as StatementBody).balance).toBe(950);
    });
  });

  describe('autorização (RolesGuard)', () => {
    it('aluno não pode criar vantagem (403)', async () => {
      await request(http)
        .post('/api/advantages')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          title: 'Não deveria criar',
          description: 'Aluno tentando criar vantagem.',
          category: 'OUTROS',
          icon: 'tag',
          costXp: 10,
        })
        .expect(403);
    });

    it('empresa não pode resgatar vantagem (403)', async () => {
      await request(http)
        .post(
          '/api/advantages/00000000-0000-0000-0000-000000000000/redemptions',
        )
        .set('Authorization', `Bearer ${companyToken}`)
        .expect(403);
    });
  });
});
