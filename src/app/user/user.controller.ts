import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
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
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.userService.findOne(id)
    }

    @Get()
    findAll(@Query() pagination: any) {
        const { limit = 10, offset = 0 } = pagination

        return this.userService.findAll(pagination)
    }

    @Patch(':id')
    update(@Body() data: UpdateUserDto, @Param('id', ParseIntPipe) id: number) {
        return this.userService.update(data, id)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id)
    }

}
