import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  clientUrl: process.env.DATABASE_URL,
  debug: isDev,
  entities: [
    path.join(
      __dirname,
      '../modules/**/infrastructure/adapters/out/orm/entities/*.js',
    ),
  ],
  entitiesTs: [
    path.join(
      __dirname,
      '../modules/**/infrastructure/adapters/out/orm/entities/*.ts',
    ),
  ],
  migrations: {
    path: path.resolve(__dirname, '../../migrations'),
    emit: 'ts',
  },
  extensions: [Migrator],
});
