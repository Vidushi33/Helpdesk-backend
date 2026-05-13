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

//Interceptor SET the organizationId for every request.

@Injectable()
export class OrganizationInterceptor implements NestInterceptor {
  constructor(private readonly organizationStorage: OrganizationStorage) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest(); //gets every request
    const organizationId = request.user?.organizationId || ''; //gets organizationId from request.user(This assumes JWT auth already added)

    return this.organizationStorage.run(organizationId, () => {
      return next.handle();
    }); //Run the ENTIRE request lifecycle inside this organization context
    //so now controller , modules, services can access organizationId anytime
  }
}
