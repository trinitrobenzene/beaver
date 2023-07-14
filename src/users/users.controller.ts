import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose from 'mongoose';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return { message: 'User not found!' };
    return this.usersService.findOne(id);
  }

  @Patch()
  update(@Body() dto: UpdateUserDto) {
    if (!mongoose.Types.ObjectId.isValid(dto.id))
      return { message: 'User not found!' };
    return this.usersService.update(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      return { message: 'User not found!' };
    return this.usersService.remove(id);
  }
}
