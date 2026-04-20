import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseSwitcherService } from './database-switcher.service';
import { Organization } from '../../database/entities/master';
import { Role } from '../../database/entities/tenant';
import * as crypto from 'crypto';

/**
 * TenantProvisioningService handles the complete tenant database provisioning workflow.
 * 
 * When a new organization signs up:
 * 1. Generate unique database name (crm_tenant_org_{uuid})
 * 2. Create PostgreSQL database
 * 3. Create Organization record in master DB
 * 4. Run migrations on new tenant database
 * 5. Seed default roles (Admin, Manager, Sales Rep)
 * 
 * This is called during org registration/signup.
 */
@Injectable()
export class TenantProvisioningService {
  private logger = new Logger(TenantProvisioningService.name);

  constructor(
    @InjectDataSource()
    private masterDataSource: DataSource,
    private databaseSwitcher: DatabaseSwitcherService,
    private configService: ConfigService,
  ) {}

  /**
   * Provision a complete new tenant with database, schema, and default data.
   * 
   * @param orgName - Organization name (e.g., "Acme Corp")
   * @param orgSlug - URL-safe slug (e.g., "acme-corp")
   * @param createdByUserId - ID of user creating the org
   * @returns Created Organization entity
   * 
   * @throws BadRequestException if database already exists
   * @throws InternalServerErrorException if provisioning fails
   */
  async provisionTenant(
    orgName: string,
    orgSlug: string,
    createdByUserId: string,
  ): Promise<Organization> {
    const orgId = crypto.randomUUID();
    const dbName = `crm_tenant_org_${orgId.replace(/-/g, '_')}`;
    const dbHost = this.configService.get('DATABASE_HOST', 'localhost');
    const dbPort = parseInt(this.configService.get('DATABASE_PORT', '5432'));
    const dbUser = this.configService.get('DATABASE_USER', 'postgres');
    const dbPassword = this.configService.get('DATABASE_PASSWORD', 'postgres');

    this.logger.log(`🚀 Starting tenant provisioning for: ${orgName} (${orgId})`);

    try {
      // Step 1: Create the PostgreSQL database
      this.logger.debug(`📦 Step 1: Creating PostgreSQL database: ${dbName}`);
      await this.createDatabase(dbName);
      this.logger.debug(`✓ Database created: ${dbName}`);

      // Step 2: Save Organization record in master DB
      this.logger.debug(`📝 Step 2: Saving Organization record in master DB`);
      const organization = new Organization();
      organization.id = orgId;
      organization.name = orgName;
      organization.slug = orgSlug;
      organization.dbHost = dbHost;
      organization.dbPort = dbPort;
      organization.dbName = dbName;
      organization.dbUser = dbUser;
      organization.dbPassword = dbPassword;
      organization.status = 'active';
      organization.planType = 'free';
      organization.maxUsers = 5;
      organization.currentUsers = 1;

      const orgRepo = this.masterDataSource.getRepository(Organization);
      const savedOrg = await orgRepo.save(organization);
      this.logger.debug(`✓ Organization saved: ${savedOrg.id}`);

      // Step 3: Initialize tenant schema and seed data
      this.logger.debug(`🔧 Step 3: Initializing tenant database schema`);
      await this.initializeTenantSchema(orgId, dbName);
      this.logger.debug(`✓ Tenant schema initialized`);

      // Step 4: Seed default roles
      this.logger.debug(`👤 Step 4: Seeding default roles`);
      await this.seedDefaultRoles(orgId);
      this.logger.debug(`✓ Default roles created`);

      this.logger.log(`✅ Tenant provisioning complete for: ${orgName} (${orgId})`);
      return savedOrg;
    } catch (error) {
      this.logger.error(`❌ Tenant provisioning failed for ${orgName}: ${error.message}`);
      
      // Attempt cleanup
      try {
        await this.dropDatabase(dbName);
      } catch (cleanupError) {
        this.logger.warn(`⚠️ Cleanup failed for database ${dbName}: ${cleanupError.message}`);
      }

      throw new InternalServerErrorException(
        `Failed to provision tenant: ${error.message}`,
      );
    }
  }

  /**
   * Create a new PostgreSQL database.
   * Requires superuser/createdb privileges.
   * 
   * @param dbName - Database name to create
   * @throws if database already exists or permission denied
   */
  private async createDatabase(dbName: string): Promise<void> {
    try {
      const dbHost = this.configService.get('DATABASE_HOST', 'localhost');
      const dbPort = this.configService.get('DATABASE_PORT', '5432');
      const adminUser = this.configService.get('DATABASE_USER', 'postgres');
      const adminPassword = this.configService.get('DATABASE_PASSWORD', 'postgres');

      // Create a temporary DataSource with admin credentials (connects to default 'postgres' DB)
      const adminDataSource = new DataSource({
        type: 'postgres',
        host: dbHost,
        port: parseInt(dbPort),
        username: adminUser,
        password: adminPassword,
        database: 'postgres', // Connect to default database to create new one
        synchronize: false,
        logging: false,
      });

      await adminDataSource.initialize();

      // Check if database already exists
      const checkResult = await adminDataSource.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName],
      );

      if (checkResult.length > 0) {
        throw new BadRequestException(`Database ${dbName} already exists`);
      }

      // Create the database
      await adminDataSource.query(`CREATE DATABASE "${dbName}"`);

      await adminDataSource.destroy();
      this.logger.debug(`✓ Database created via admin connection: ${dbName}`);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        `Failed to create database ${dbName}: ${error.message}`,
      );
    }
  }

  /**
   * Initialize the tenant database schema.
   * 
   * Development: Uses TypeORM synchronize
   * Production: Runs migrations
   * 
   * @param orgId - Organization ID
   * @param dbName - Database name
   */
  private async initializeTenantSchema(orgId: string, dbName: string): Promise<void> {
    try {
      const tenantDataSource = await this.databaseSwitcher.getDataSourceForOrganization(orgId);

      // In development, use synchronize to create schema
      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.debug(`Using synchronize for schema creation (dev mode)`);
        await tenantDataSource.synchronize();
      } else {
        // In production, run migrations
        this.logger.debug(`Running migrations (production mode)`);
        await tenantDataSource.runMigrations();
      }

      this.logger.debug(`✓ Schema initialized for org ${orgId}`);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to initialize schema for ${dbName}: ${error.message}`,
      );
    }
  }

  /**
   * Seed default roles for the organization.
   * Creates: Admin, Manager, Sales Rep, User roles
   * 
   * @param orgId - Organization ID (same as tenantId)
   */
  private async seedDefaultRoles(orgId: string): Promise<void> {
    try {
      const tenantDataSource = await this.databaseSwitcher.getDataSourceForOrganization(orgId);
      const roleRepo = tenantDataSource.getRepository(Role);

      const roles = [
        {
          name: 'Admin',
          description: 'Full access to all features and organization settings',
          type: 'admin',
          isDefault: true,
        },
        {
          name: 'Manager',
          description: 'Can manage team members and view analytics',
          type: 'manager',
          isDefault: true,
        },
        {
          name: 'Sales Rep',
          description: 'Can manage own accounts, contacts, and opportunities',
          type: 'user',
          isDefault: true,
        },
        {
          name: 'User',
          description: 'Limited read-only access',
          type: 'user',
          isDefault: false,
        },
      ];

      for (const roleData of roles) {
        const role = new Role();
        role.id = crypto.randomUUID();
        role.tenantId = orgId; // Match actual entity field name
        role.name = roleData.name;
        role.description = roleData.description;
        role.type = roleData.type as any;
        role.isDefault = roleData.isDefault;

        await roleRepo.save(role);
        this.logger.debug(`✓ Created role: ${roleData.name}`);
      }

      this.logger.debug(`✓ Default roles seeded for org ${orgId}`);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to seed roles for org ${orgId}: ${error.message}`,
      );
    }
  }

  /**
   * Delete a tenant database (cleanup on org deletion).
   * 
   * CAUTION: This is irreversible.
   * 
   * @param dbName - Database name to drop
   */
  async dropDatabase(dbName: string): Promise<void> {
    try {
      const dbHost = this.configService.get('DATABASE_HOST', 'localhost');
      const dbPort = this.configService.get('DATABASE_PORT', '5432');
      const adminUser = this.configService.get('DATABASE_USER', 'postgres');
      const adminPassword = this.configService.get('DATABASE_PASSWORD', 'postgres');

      const adminDataSource = new DataSource({
        type: 'postgres',
        host: dbHost,
        port: parseInt(dbPort),
        username: adminUser,
        password: adminPassword,
        database: 'postgres',
        synchronize: false,
        logging: false,
      });

      await adminDataSource.initialize();

      // Terminate all connections to the database before dropping
      await adminDataSource.query(`
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
          AND pid <> pg_backend_pid()
      `, [dbName]);

      // Drop the database
      await adminDataSource.query(`DROP DATABASE IF EXISTS "${dbName}"`);

      await adminDataSource.destroy();
      this.logger.log(`✓ Database dropped: ${dbName}`);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to drop database ${dbName}: ${error.message}`,
      );
    }
  }

  /**
   * List all tenant databases (for monitoring/debugging).
   * 
   * @returns Array of database names
   */
  async listTenantDatabases(): Promise<string[]> {
    try {
      const dbHost = this.configService.get('DATABASE_HOST', 'localhost');
      const dbPort = this.configService.get('DATABASE_PORT', '5432');
      const adminUser = this.configService.get('DATABASE_USER', 'postgres');
      const adminPassword = this.configService.get('DATABASE_PASSWORD', 'postgres');

      const adminDataSource = new DataSource({
        type: 'postgres',
        host: dbHost,
        port: parseInt(dbPort),
        username: adminUser,
        password: adminPassword,
        database: 'postgres',
        synchronize: false,
        logging: false,
      });

      await adminDataSource.initialize();

      const result = await adminDataSource.query(`
        SELECT datname FROM pg_database 
        WHERE datname LIKE 'crm_tenant_org_%'
        ORDER BY datname
      `);

      await adminDataSource.destroy();

      return result.map((row: any) => row.datname);
    } catch (error) {
      this.logger.error(`Failed to list tenant databases: ${error.message}`);
      return [];
    }
  }
}
