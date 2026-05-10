import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getOneUser(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Post()
  async createNewUser(@Body() data: CreateUserDto): Promise<User> {
    return this.userService.addUser(data);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() data: Partial<CreateUserDto>,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return this.userService.deleteUser(id);
  }
}
