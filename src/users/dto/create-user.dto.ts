import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entity/user.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Matches(/^[0-9]{10}$/)
  @IsNotEmpty()
  phone!: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password is too short!' })
  password!: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  @IsNotEmpty()
  organizationId!: string;
}
