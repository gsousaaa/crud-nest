import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { NotFoundException } from '@nestjs/common';

const mockCompany = {
    id: 1,
    name: 'Empresa Teste',
    cnpj: '12345678000100',
    email: 'empresateste@contato.com.br'
} as Company;

describe('CompanyService', () => {
    let service: CompanyService;
    let companyRepository: jest.Mocked<Repository<Company>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompanyService,
                {
                    provide: getRepositoryToken(Company),
                    useValue: {
                        findOne: jest.fn(),
                        find: jest.fn(),
                        save: jest.fn(),
                        update: jest.fn(),
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CompanyService>(CompanyService);
        companyRepository = module.get(getRepositoryToken(Company));
    });

    describe('create', () => {
        it('deve criar uma nova empresa', async () => {
            companyRepository.findOne.mockResolvedValue(null);
            companyRepository.save.mockResolvedValue(mockCompany);

            const data = { name: 'Empresa Teste', cnpj: '12345678000100', email: 'teste@contato.com' };
            const result = await service.create(data);

            expect(companyRepository.findOne).toHaveBeenCalledWith({ where: { cnpj: data.cnpj } });
            expect(companyRepository.save).toHaveBeenCalledWith(data);
            expect(result).toEqual(mockCompany);
        });

        it('deve lançar erro se a empresa já existir', async () => {
            companyRepository.findOne.mockResolvedValue(mockCompany);

            await expect(service.create({ name: 'Empresa', cnpj: mockCompany.cnpj, email: mockCompany.email }))
                .rejects
                .toThrow('Empresa já cadastrado!');
        });
    });

    describe('findAll', () => {
        it('deve retornar todas as empresas paginadas', async () => {
            companyRepository.find.mockResolvedValue([mockCompany]);

            const result = await service.findAll({ page: 1, limit: 10 });
            expect(companyRepository.find).toHaveBeenCalledWith({ take: 10, skip: 0 });
            expect(result).toEqual([mockCompany]);
        });
    });

    describe('findOne', () => {
        it('deve retornar uma empresa por ID', async () => {
            companyRepository.findOne.mockResolvedValue(mockCompany);

            const result = await service.findOne(1);
            expect(result).toEqual(mockCompany);
        });

        it('deve lançar NotFoundException se não encontrar empresa', async () => {
            companyRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('deve atualizar empresa se ela existir', async () => {
            companyRepository.findOne.mockResolvedValue(mockCompany);
            companyRepository.update.mockResolvedValue({ affected: 1 } as any);

            const result = await service.update({ name: 'Nova Razão' }, 1);
            expect(companyRepository.update).toHaveBeenCalledWith({ id: 1 }, { name: 'Nova Razão' });
            expect(result).toEqual({ affected: 1 });
        });

        it('deve lançar NotFoundException se empresa não existir', async () => {
            companyRepository.findOne.mockResolvedValue(null);
            await expect(service.update({ name: 'X' }, 1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('delete', () => {
        it('deve deletar empresa se ela existir', async () => {
            companyRepository.findOne.mockResolvedValue(mockCompany);
            companyRepository.delete.mockResolvedValue({ affected: 1 } as any);

            const result = await service.delete(1);
            expect(companyRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({ affected: 1 });
        });

        it('deve lançar NotFoundException se empresa não existir', async () => {
            companyRepository.findOne.mockResolvedValue(null);
            await expect(service.delete(1)).rejects.toThrow(NotFoundException);
        });
    });
});
