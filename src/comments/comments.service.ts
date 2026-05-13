import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationStorage } from '../common/storage/organization-storage';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Ticket } from '../tickets/entity/ticket.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Ticket) private ticketRepo: Repository<Ticket>,
    private readonly storage: OrganizationStorage,
  ) {}

  async createComment(
    createCommentDto: CreateCommentDto,
    creatorId: string,
    ticketId: string,
  ): Promise<Comment> {
    const { content, isInternalComment } = createCommentDto;

    const orgId = this.storage.getOrganizationId();
    const ticket = await this.ticketRepo.findOne({
      where: { id: ticketId, organizationId: orgId },
    });
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const comment = this.commentRepo.create({
      content,
      isInternalComment,
      organizationId: orgId,
      ticket: { id: ticketId },
      creator: { id: creatorId },
    });

    return this.commentRepo.save(comment);
  }

  async findConversation(
    ticketId: string,
    userRole: string,
  ): Promise<Comment[]> {
    const orgId = this.storage.getOrganizationId();
    const query = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.creator', 'creator')
      .where('comment.ticketId = :ticketId', { ticketId })
      .andWhere('comment.organizationId = :orgId', { orgId });

    if (userRole === 'customer') {
      query.andWhere('comment.internalComment = false');
    }

    return query.orderBy('comment.createdAt', 'ASC').getMany();
  }
}
