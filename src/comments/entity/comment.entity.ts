import { Ticket } from '@/src/tickets/entity/ticket.entity';
import { User } from '@/src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  content!: string;

  @Column({ default: false })
  isInternalComment?: boolean;

  @Column()
  organizationId!: string;

  @ManyToOne(() => Ticket)
  ticket!: Ticket;

  @ManyToOne(() => User)
  creator!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
