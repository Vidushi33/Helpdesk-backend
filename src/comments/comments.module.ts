import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { OrganizationStorage } from '../common/storage/organization-storage';
import { Ticket } from '../tickets/entity/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Ticket])],
  providers: [CommentsService, OrganizationStorage],
  controllers: [CommentsController],
})
export class CommentsModule {}
