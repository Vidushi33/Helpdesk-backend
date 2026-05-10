import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TicketStatus } from '../entity/ticket.entity';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @MinLength(20)
  description!: string;

  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;

  @IsUUID()
  creatorId!: string;

  @IsUUID()
  @IsOptional()
  assignedAgentId?: string;
}
