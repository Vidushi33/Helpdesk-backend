import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entity/ticket.entity';
import { Repository } from 'typeorm';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { User } from '../users/entity/user.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  //   Create a new ticket
  async create(data: CreateTicketDto): Promise<Ticket> {
    const { title, description, status, creatorId, assignedAgentId } = data;

    const creator = await this.userRepo.findOneBy({ id: creatorId });

    if (!creator) {
      throw new NotFoundException('Creator Not Found');
    }

    let assignedAgent: User | null = null;
    if (assignedAgentId) {
      assignedAgent = await this.userRepo.findOneBy({ id: assignedAgentId });

      if (!assignedAgent) {
        throw new NotFoundException('Assigned Agent Not Found');
      }
    }

    const ticket = this.ticketRepo.create({
      title,
      description,
      status,
      creator,
      assignedAgent: assignedAgent || undefined,
    });

    return this.ticketRepo.save(ticket);
  }

  //   Get all tickets with creator and assigned agent details
  async getAllTickets(): Promise<Ticket[]> {
    return this.ticketRepo.find({
      relations: ['creator', 'assignedAgent'],
    });
  }

  //   Get a single ticket by ID with creator and assigned agent details
  async getTicketById(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['creator', 'assignedAgent'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }

    return ticket;
  }

  //   Update a ticket's details\
  async updateTicket(
    id: string,
    data: Partial<CreateTicketDto>,
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }

    if (data.title) ticket.title = data.title;
    if (data.description) ticket.description = data.description;
    if (data.status) ticket.status = data.status;

    if (data.assignedAgentId) {
      const newAgent = await this.userRepo.findOneBy({
        id: data.assignedAgentId,
      });

      if (!newAgent) {
        throw new NotFoundException('Assigned Agent Not Found');
      }
      ticket.assignedAgent = newAgent;
    }

    return this.ticketRepo.save(ticket);
  }

  //Update a ticket's status
  async updateTicketStatus(
    id: string,
    status: Ticket['status'],
  ): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }
    ticket.status = status;
    return this.ticketRepo.save(ticket);
  }

  //   Reassign a ticket to a different agent
  async reassignAgent(id: string, newAgentId: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }

    const newAgent = await this.userRepo.findOneBy({ id: newAgentId });
    if (!newAgent) {
      throw new NotFoundException('New Agent Not Found');
    }
    ticket.assignedAgent = newAgent;
    return this.ticketRepo.save(ticket);
  }

  //   Delete a ticket
  async deleteTicket(id: string): Promise<Ticket> {
    const ticket = await this.ticketRepo.findOneBy({ id });
    if (!ticket) {
      throw new NotFoundException('Ticket Not Found');
    }

    return await this.ticketRepo.remove(ticket);
  }
}
