import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { PaginationDto } from '../dto/pagination-dto';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company-dto';
import { UpdateCompanyDto } from './dto/update-company-dto';

@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Body() data: CreateCompanyDto) {
        return this.companyService.create(data)
    }

    @Get()
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.companyService.findOne(id)
    }

    @Get()
    findAll(@Query() pagination: PaginationDto) {
        const { limit = 10, page = 1 } = pagination

        return this.companyService.findAll(pagination)
    }

    @Patch(':id')
    update(@Body() data: UpdateCompanyDto, @Param('id', ParseIntPipe) id: number) {
        return this.companyService.update(data, id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.companyService.delete(id)
    }

}
