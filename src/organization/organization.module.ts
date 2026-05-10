import { Module } from '@nestjs/common';
import { Organization } from './enitity/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  providers: [OrganizationService],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
