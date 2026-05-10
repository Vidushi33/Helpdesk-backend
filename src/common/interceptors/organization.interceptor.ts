/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { OrganizationStorage } from '../storage/organization-storage';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizationInterceptor implements NestInterceptor {
  constructor(private readonly organizationStorage: OrganizationStorage) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const organizationId = request.user?.organizationId || '';

    return this.organizationStorage.run(organizationId, () => {
      return next.handle();
    });
  }
}
