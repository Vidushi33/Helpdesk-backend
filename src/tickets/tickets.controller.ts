import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Ticket, TicketStatus } from './entity/ticket.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entity/user.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAllTickets(): Promise<Ticket[]> {
    return this.ticketsService.getAllTickets();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findTicketById(id: string): Promise<Ticket> {
    return this.ticketsService.getTicketById(id);
  }

  @Post()
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  createTicket(@Body() body: CreateTicketDto): Promise<Ticket> {
    return this.ticketsService.create(body);
  }

  @Patch('status/:id')
  @Roles(UserRole.ADMIN)
  updateTicketStatus(
    @Param('id') id: string,
    @Body('status') status: TicketStatus,
  ): Promise<Ticket> {
    return this.ticketsService.updateTicketStatus(id, status);
  }

  @Patch('reassignAgent/:id')
  @Roles(UserRole.ADMIN)
  reassignTicketAgent(
    @Param('id') id: string,
    @Body('agentId') agentId: string,
  ): Promise<Ticket> {
    return this.ticketsService.reassignAgent(id, agentId);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateTicket(
    @Param('id') id: string,
    @Body() body: CreateTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.updateTicket(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteTicket(@Param('id') id: string): Promise<Ticket> {
    return this.ticketsService.deleteTicket(id);
  }
}
