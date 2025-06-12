import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from 'src/entities/company.entity';
import { PaginationDto } from '../dto/pagination-dto';
import { ICreateCompany } from 'src/types/ICreateCompany';
@Injectable()
export class CompanyService {
    constructor(@InjectRepository(Company) private companyRepository: Repository<Company>) { }

    async create(data: ICreateCompany) {
        const existsCompany = await this.companyRepository.findOne({ where: { cnpj: data.cnpj } })

        if (existsCompany) throw new Error('Empresa já cadastrado!')

        return await this.companyRepository.save(data)
    }

    async findAll(pagination: PaginationDto) {
        return await this.companyRepository.find({ take: pagination.limit, skip: (pagination.page - 1) * pagination.limit })
    }

    async findOne(id: number) {
        const user = await this.companyRepository.findOne({ where: { id } })
        if (!user) throw new NotFoundException('Usuario não encontrado!')

        return user
    }

    async update(fields: Partial<Company>, id: number) {
        const existsCompany = await this.companyRepository.findOne({ where: { id } })
        if (!existsCompany) throw new NotFoundException(`Empresa não encontrada!`)
            
        return await this.companyRepository.update({ id }, fields)
    }

    async delete(id: number) {
        const existsCompany = await this.companyRepository.findOne({ where: { id } })
        if (!existsCompany) throw new NotFoundException(`Empresa não encontrada!`)

        return this.companyRepository.delete(id)
    }
}

