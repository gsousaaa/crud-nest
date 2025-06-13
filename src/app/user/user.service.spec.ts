import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import bcrypt from 'bcrypt'

import { User } from 'src/entities/user.entity';

const mockUser = {
  id: 1,
  name: 'test',
  email: 'test@example.com',
  password: 'hashedPassword',
} as User;

jest.mock('bcrypt', () => ({
  __esModule: true,
  default: {
    hash: jest.fn(() => Promise.resolve('fake-hash')),
  },
}));

const userArray = [mockUser];

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
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

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('create', () => {
    it('deve criar um novo usuário', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockImplementation(async (user) => {
        return {
          id: 1,
          email: user.email,
          password: user.password,
          name: 'Test User',
          created_at: new Date(),
          updated_at: new Date(),
        } as User;
      });

      const data = { username: 'test', email: 'test@example.com', password: '123456' };
      const result = await service.create(data);

      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email: data.email } });
      expect(result.password).toBe('fake-hash');
    });

    it('deve lançar erro se o usuário já existir', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({ username: 'test', email: mockUser.email, password: '123456' }),
      ).rejects.toThrow('Usuário já cadastrado!');
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os usuários com paginação', async () => {
      userRepository.find.mockResolvedValue(userArray);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(userRepository.find).toHaveBeenCalledWith({ take: 10, skip: 0 });
      expect(result).toEqual(userArray);
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário pelo ID', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);
      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o usuário se existir', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.update({ email: 'updated@example.com' }, 1);
      expect(userRepository.update).toHaveBeenCalledWith({ id: 1 }, { email: 'updated@example.com' });
      expect(result).toEqual({ affected: 1 });
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.update({ email: 'x' }, 1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('deve deletar o usuário se existir', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);
      userRepository.delete.mockResolvedValue({ affected: 1 } as any);

      const result = await service.delete(1);
      expect(userRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ affected: 1 });
    });

    it('deve lançar NotFoundException se o usuário não existir', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
