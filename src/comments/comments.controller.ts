/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { Comment } from './entity/comment.entity';
import { UserRole } from '../users/entity/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':ticketId/comments')
  @UseGuards(AuthGuard('jwt'))
  async getConversation(
    @Param('ticketId') ticketId: string,
    @Request() req,
  ): Promise<Comment[]> {
    const userRole = req.user.role as UserRole;
    return this.commentsService.findConversation(ticketId, userRole);
  }

  @Post(':ticketId/comments')
  @UseGuards(AuthGuard('jwt'))
  async createComment(
    @Param('ticketId') ticketId: string,
    @Body() body: CreateCommentDto,
    @Request() req,
  ): Promise<Comment> {
    const userId = req.user.id;
    return this.commentsService.createComment(body, userId, ticketId);
  }
}
