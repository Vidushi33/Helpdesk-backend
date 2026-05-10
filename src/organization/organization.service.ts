import { Injectable } from '@nestjs/common';
import { Organization } from './enitity/organization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrgDto } from './dto/create-org.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private orgRepo: Repository<Organization>,
  ) {}

  async getAllOrg(): Promise<Organization[]> {
    return this.orgRepo.find({ relations: ['users'] });
  }

  async getOneOrg(id: string): Promise<Organization | null> {
    return this.orgRepo.findOne({ where: { id }, relations: ['users'] });
  }

  async createOrg(data: CreateOrgDto): Promise<Organization> {
    const newOrg = this.orgRepo.create(data);
    return this.orgRepo.save(newOrg);
  }
}
