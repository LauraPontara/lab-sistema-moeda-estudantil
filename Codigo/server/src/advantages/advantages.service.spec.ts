import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AdvantagesRepository } from './advantages.repository';
import { AdvantagesService } from './advantages.service';
import { CreateAdvantageDto } from './dto/create-advantage.dto';
import { AdvantageModel } from './models/advantage.model';
import { RedemptionEvent } from './redemption-event.type';
import { RedemptionQueueService } from './redemption-queue.service';

const advantageModel = (
  overrides: Partial<AdvantageModel> = {},
): AdvantageModel => ({
  id: 'adv-1',
  companyId: 'company-1',
  companyName: 'Café da Esquina',
  title: '10% de desconto no R.U.',
  description: 'Desconto no restaurante universitário.',
  category: 'ALIMENTACAO',
  icon: 'utensils',
  costXp: 50,
  active: true,
  createdAt: new Date('2026-05-23T00:00:00.000Z'),
  updatedAt: new Date('2026-05-23T00:00:00.000Z'),
  ...overrides,
});

const redemptionEvent = (): RedemptionEvent => ({
  redemptionId: 'red-1',
  couponCode: 'ABCDEF012345',
  redeemedAt: '2026-05-23T00:00:00.000Z',
  advantage: { id: 'adv-1', title: '10% de desconto no R.U.', costXp: 50 },
  student: {
    id: 'student-1',
    name: 'Aluno Teste',
    email: 'aluno@gmail.com',
    whatsappPhone: null,
    balanceAfter: 50,
  },
  company: {
    id: 'company-1',
    tradeName: 'Café da Esquina',
    email: 'empresa@gmail.com',
    whatsappPhone: null,
  },
});

interface RepositoryMock {
  create: jest.Mock;
  findByCompany: jest.Mock;
  findActiveCatalog: jest.Mock;
  softDelete: jest.Mock;
  redeem: jest.Mock;
}

interface QueueMock {
  publishRedemption: jest.Mock;
}

describe('AdvantagesService', () => {
  let service: AdvantagesService;
  let repository: RepositoryMock;
  let queue: QueueMock;

  beforeEach(async () => {
    repository = {
      create: jest.fn(),
      findByCompany: jest.fn(),
      findActiveCatalog: jest.fn(),
      softDelete: jest.fn(),
      redeem: jest.fn(),
    };
    queue = { publishRedemption: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdvantagesService,
        { provide: AdvantagesRepository, useValue: repository },
        { provide: RedemptionQueueService, useValue: queue },
      ],
    }).compile();

    service = module.get(AdvantagesService);
  });

  describe('createAdvantage', () => {
    it('repassa o companyId do usuário atual ao repositório', async () => {
      const dto: CreateAdvantageDto = {
        title: 'Café da manhã grátis',
        description: 'Um café da manhã por conta da casa.',
        category: 'ALIMENTACAO',
        icon: 'coffee',
        costXp: 80,
      };
      const created = advantageModel({
        title: dto.title,
        icon: 'coffee',
        costXp: 80,
      });
      repository.create.mockResolvedValue(created);

      const result = await service.createAdvantage('company-1', dto);

      expect(repository.create).toHaveBeenCalledWith('company-1', dto);
      expect(result).toBe(created);
    });
  });

  describe('listByCompany / listCatalog', () => {
    it('retorna as vantagens da empresa', async () => {
      const rows = [advantageModel()];
      repository.findByCompany.mockResolvedValue(rows);

      await expect(service.listByCompany('company-1')).resolves.toBe(rows);
      expect(repository.findByCompany).toHaveBeenCalledWith('company-1');
    });

    it('retorna o catálogo ativo', async () => {
      const rows = [advantageModel(), advantageModel({ id: 'adv-2' })];
      repository.findActiveCatalog.mockResolvedValue(rows);

      await expect(service.listCatalog()).resolves.toBe(rows);
      expect(repository.findActiveCatalog).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteAdvantage', () => {
    it('conclui quando o soft delete afeta uma linha', async () => {
      repository.softDelete.mockResolvedValue(true);

      await expect(
        service.deleteAdvantage('adv-1', 'company-1'),
      ).resolves.toBeUndefined();
      expect(repository.softDelete).toHaveBeenCalledWith('adv-1', 'company-1');
    });

    it('lança NotFoundException quando não é dono ou não existe', async () => {
      repository.softDelete.mockResolvedValue(false);

      await expect(
        service.deleteAdvantage('adv-1', 'outra-empresa'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('redeemForStudent', () => {
    it('publica o evento uma vez e retorna cupom + saldo no sucesso', async () => {
      const event = redemptionEvent();
      repository.redeem.mockResolvedValue({
        status: 'ok',
        balanceAfter: 50,
        couponCode: 'ABCDEF012345',
        event,
      });

      const result = await service.redeemForStudent('student-1', 'adv-1');

      expect(result).toEqual({
        message: 'Resgate realizado com sucesso.',
        couponCode: 'ABCDEF012345',
        balance: 50,
      });
      expect(queue.publishRedemption).toHaveBeenCalledTimes(1);
      expect(queue.publishRedemption).toHaveBeenCalledWith(event);
    });

    it('lança BadRequestException e não publica quando saldo é insuficiente', async () => {
      repository.redeem.mockResolvedValue({
        status: 'insufficient_balance',
        balanceAfter: 10,
        couponCode: null,
        event: null,
      });

      await expect(
        service.redeemForStudent('student-1', 'adv-1'),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(queue.publishRedemption).not.toHaveBeenCalled();
    });

    it('lança NotFoundException quando a vantagem está indisponível', async () => {
      repository.redeem.mockResolvedValue({
        status: 'advantage_unavailable',
        balanceAfter: 100,
        couponCode: null,
        event: null,
      });

      await expect(
        service.redeemForStudent('student-1', 'adv-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(queue.publishRedemption).not.toHaveBeenCalled();
    });

    it('lança NotFoundException quando o aluno não existe', async () => {
      repository.redeem.mockResolvedValue({
        status: 'not_found',
        balanceAfter: 0,
        couponCode: null,
        event: null,
      });

      await expect(
        service.redeemForStudent('inexistente', 'adv-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(queue.publishRedemption).not.toHaveBeenCalled();
    });
  });
});
