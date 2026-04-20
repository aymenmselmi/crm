import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantContextService {
  private tenantId: string | null = null;
  private organizationId: string | null = null;
  private userId: string | null = null;

  setTenantContext(organizationId: string, userId: string) {
    this.organizationId = organizationId;
    this.userId = userId;
    this.tenantId = organizationId; // In this architecture, organizationId = tenantId
  }

  getTenantId(): string | null {
    return this.tenantId;
  }

  getOrganizationId(): string | null {
    return this.organizationId;
  }

  getUserId(): string | null {
    return this.userId;
  }

  isInitialized(): boolean {
    return this.organizationId !== null && this.userId !== null;
  }

  clear() {
    this.tenantId = null;
    this.organizationId = null;
    this.userId = null;
  }
}
