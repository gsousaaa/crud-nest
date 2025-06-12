import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ICreateUser } from 'src/types/ICreateUser';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt'
import { PaginationDto } from '../dto/pagination-dto';
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }

    async create(data: ICreateUser) {
        const existsUser = await this.userRepository.findOne({ where: { email: data.email } })

        if (existsUser) throw new Error('Usuário já cadastrado!')

        return await this.userRepository.save({ ...data, password: await bcrypt.hash(data.password, 10) })
    }

    async findAll(pagination: PaginationDto) {
        return await this.userRepository.find({ take: pagination.limit, skip: (pagination.page - 1) * pagination.limit })
    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException('Usuario não encontrado!')

        return user
    }

    async update(fields: Partial<User>, id: number) {
        const existsUser = await this.userRepository.findOne({ where: { id } })
        if (!existsUser) throw new NotFoundException('Usuario não encontrado!')

        return await this.userRepository.update({ id }, fields)
    }

    async delete(id: number) {
        const existsUser = await this.userRepository.findOne({ where: { id } })
        if (!existsUser) throw new NotFoundException('Usuario não encontrado!')

        return this.userRepository.delete(id)
    }
}

