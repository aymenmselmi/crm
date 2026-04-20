import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './src/database/schema',
  out: './src/database/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.MASTER_DB_URL || 'postgresql://postgres:postgres@localhost:5432/crm_master',
  },
  verbose: true,
  strict: true,
});
