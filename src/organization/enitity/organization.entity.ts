/* eslint-disable @typescript-eslint/no-unsafe-return */
import { User } from '@/src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('organization')
export class Organization {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  slug!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => User, (user) => user.organization)
  users!: User[];
}
