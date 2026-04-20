import { Injectable } from '@nestjs/common';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TenantContextService } from './tenant-context.service';
import { DatabaseSwitcherService } from './database-switcher.service';

/**
 * Base service for tenant-aware operations
 * Automatically filters all queries by tenantId
 * 
 * In MVP mode: Uses single shared database with tenantId filtering
 * In production: Can switch between tenant-specific databases
 */
@Injectable()
export class TenantAwareService {
  constructor(
    protected tenantContextService: TenantContextService,
    protected databaseSwitcher?: DatabaseSwitcherService,
  ) {}

  /**
   * Get tenant ID from context
   */
  protected getTenantId(): string {
    const tenantId = this.tenantContextService.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not initialized');
    }
    return tenantId;
  }

  /**
   * Apply tenant filter to a query
   * Used with TypeORM QueryBuilder
   */
  protected applyTenantFilter<T>(
    queryBuilder: SelectQueryBuilder<T>,
    tenantIdColumn: string = 'tenantId',
  ): SelectQueryBuilder<T> {
    const tenantId = this.getTenantId();
    return queryBuilder.where(`${tenantId} = :tenantId`, { tenantId });
  }

  /**
   * Apply tenant filter with existing where clause
   */
  protected applyTenantFilterAndCondition<T>(
    queryBuilder: SelectQueryBuilder<T>,
    whereCondition: string,
    parameters: Record<string, any>,
    tenantIdColumn: string = 'tenantId',
  ): SelectQueryBuilder<T> {
    const tenantId = this.getTenantId();
    return queryBuilder.where(
      `${tenantIdColumn} = :tenantId AND ${whereCondition}`,
      { tenantId, ...parameters },
    );
  }

  /**
   * Check if tenant is initialized
   */
  protected isTenantInitialized(): boolean {
    return this.tenantContextService.isInitialized();
  }

  /**
   * Get repository for entity in the correct database
   * 
   * If DatabaseSwitcherService is available, gets repo from switched DataSource.
   * Otherwise uses the default DataSource injected into derived classes.
   * 
   * @param dataSource - DataSource to get repository from (usually injected)
   * @param entityType - Entity class
   * @returns Repository for the entity
   */
  protected getRepository<T>(dataSource: DataSource, entityType: any): Repository<T> {
    return dataSource.getRepository(entityType);
  }

  /**
   * Get organization ID (for context in queries)
   */
  protected getOrganizationId(): string {
    const organizationId = this.tenantContextService.getOrganizationId();
    if (!organizationId) {
      throw new Error('Organization context not initialized');
    }
    return organizationId;
  }
}
