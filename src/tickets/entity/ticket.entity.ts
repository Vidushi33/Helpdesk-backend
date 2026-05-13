/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Organization } from '@/src/organization/enitity/organization.entity';
import { User } from '@/src/users/entity/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text') //this text is the type of the column in the database
  description!: string;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.OPEN })
  status!: TicketStatus;

  @ManyToOne(() => User)
  creator!: User;

  @ManyToOne(() => User, { nullable: true })
  assignedAgent?: User;

  @Column()
  organizationId!: string;

  @ManyToOne(() => Organization)
  organization!: Organization;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
