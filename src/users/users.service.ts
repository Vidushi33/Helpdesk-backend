import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepo.find();
    if (!users || users.length === 0) {
      throw new NotFoundException('No Users Found');
    }
    return users;
  }

  async getUserById(id: string): Promise<User> {
    const findUser = await this.userRepo.findOne({ where: { id } });
    if (!findUser) {
      throw new NotFoundException('No User Found');
    }
    return findUser;
  }

  async addUser(data: CreateUserDto): Promise<User> {
    const { email, password, role, organizationId, name, phone } = data;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser)
      throw new ConflictException('User with this email already exists');

    const hash = await bcrypt.hash(password, 10);
    const newUser = this.userRepo.create({
      name,
      email,
      phone,
      password: hash,
      role: role ?? UserRole.CUSTOMER,
      organizationId,
    });

    return this.userRepo.save(newUser);
  }

  async updateUser(id: string, data: Partial<CreateUserDto>): Promise<User> {
    const updated = await this.userRepo.findOneBy({ id });

    if (!updated) {
      throw new NotFoundException('No User Found To Update');
    }

    Object.assign(updated, data);
    return this.userRepo.save(updated);
  }

  async deleteUser(id: string): Promise<User> {
    const deletedUser = await this.userRepo.findOneBy({ id });

    if (!deletedUser) {
      throw new NotFoundException('No User Found To Delete');
    }
    return this.userRepo.remove(deletedUser);
  }
}
