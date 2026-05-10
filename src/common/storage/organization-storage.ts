import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class OrganizationStorage {
  private static storage = new AsyncLocalStorage<{ organizationId: string }>();

  run<T>(organizationId: string, callback: () => T): T {
    return OrganizationStorage.storage.run({ organizationId }, callback);
  }

  getOrganizationId(): string | undefined {
    return OrganizationStorage.storage.getStore()?.organizationId;
  }
}
