import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export interface LoginResponse {
  access_token: string;
  user: Partial<User>;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(userDto: CreateUserDto): Promise<User> {
    const { email, password, role, organizationId, name, phone } = userDto;

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

  async validateUser(userDto: Partial<CreateUserDto>): Promise<LoginResponse> {
    const { email, password } = userDto;

    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) throw new NotFoundException('No user found');

    const isMatch = await bcrypt.compare(password!, user.password);
    if (!isMatch) throw new UnauthorizedException('Password didn’t match');

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      organization: user.organizationId,
      name: user.name,
      phone: user.phone,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        email: user.email,
        role: user.role,
        name: user.name,
        phone: user.phone,
      },
    };
  }
}
