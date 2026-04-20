import { Module, Global } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantContextService } from './services/tenant-context.service';
import { TenantAwareService } from './services/tenant-aware.service';
import { DatabaseSwitcherService } from './services/database-switcher.service';
import { TenantProvisioningService } from './services/tenant-provisioning.service';
import { TenantInterceptor } from './interceptors/tenant.interceptor';
import { Organization, GlobalUser, TenantConfig } from '../database/entities/master';

@Global()
@Module({
  imports: [
    // Import master entities from TypeORM so DatabaseSwitcherService can inject DataSource
    TypeOrmModule.forFeature([Organization, GlobalUser, TenantConfig]),
  ],
  providers: [
    TenantContextService,
    DatabaseSwitcherService,
    TenantProvisioningService,
    TenantAwareService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [
    TenantContextService,
    TenantAwareService,
    DatabaseSwitcherService,
    TenantProvisioningService,
  ],
})
export class TenantModule {}
