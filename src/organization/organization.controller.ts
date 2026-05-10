import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Organization } from './enitity/organization.entity';
import { OrganizationService } from './organization.service';
import { CreateOrgDto } from './dto/create-org.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Get()
  async getAllOrg(): Promise<Organization[]> {
    return this.orgService.getAllOrg();
  }

  @Get(':id')
  async getOrgById(@Param('id') id: string): Promise<Organization | null> {
    return this.orgService.getOneOrg(id);
  }

  @Post()
  async createOrg(@Body() data: CreateOrgDto): Promise<Organization> {
    return this.orgService.createOrg(data);
  }
}
