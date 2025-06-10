import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { UpdateUserDto } from './dto/update-user-dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Body() data: CreateUserDto) {
        return this.userService.create(data)
    }

    @Get()
    findOne(@Param('id') id: string) {
        return this.userService.findOne(Number(id))
    }

    @Get()
    findAll(@Query() pagination: any) {
        const { limit = 10, offset = 0 } = pagination

        return this.userService.findAll(pagination)
    }

    @Patch(':id')
    update(@Body() data: UpdateUserDto, @Param('id') id: string) {
        return this.userService.update(data, Number(id))
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(Number(id))
    }

}
