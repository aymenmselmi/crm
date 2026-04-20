import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  envFilePath: ['.env.development', '.env'],
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'crm_dev',
  entities: [path.join(__dirname, 'src/**/*.entity.ts')],
  migrations: [path.join(__dirname, 'src/database/migrations/*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
});

// Master database for tenant/organization management
export const MasterDataSource = new DataSource({
  type: 'postgres',
  url: process.env.MASTER_DB_URL || 'postgresql://postgres:postgres@localhost:5432/crm_master_dev',
  entities: [path.join(__dirname, 'src/**/*.master-entity.ts')],
  migrations: [path.join(__dirname, 'src/database/migrations/*.master*.ts')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  logger: 'advanced-console',
});
