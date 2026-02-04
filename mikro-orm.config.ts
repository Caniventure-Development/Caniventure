import { env } from 'node:process'
import 'dotenv/config' // eslint-disable-line import-x/no-unassigned-import
import { defineConfig } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'

const isDevelopment =
  (env.NODE_ENV ?? 'production').toLowerCase() === 'development'

if (
  !env['DATABASE_NAME'] ||
  !env['DATABASE_USER'] ||
  !env['DATABASE_PASSWORD'] ||
  !env['DATABASE_HOST'] ||
  !env['DATABASE_PORT']
) {
  throw new Error(
    'Missing environment variables, make sure DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, and DATABASE_PORT are set in your .env file'
  )
}

export default defineConfig({
  dbName: env['DATABASE_NAME'],
  user: env['DATABASE_USER'],
  password: env['DATABASE_PASSWORD'],
  host: env['DATABASE_HOST'],
  port: Number(env['DATABASE_PORT']),
  metadataProvider: TsMorphMetadataProvider,
  debug: isDevelopment,
  entities: ['dist/entities/**/*.entity.js'],
  entitiesTs: ['src/entities/**/*.entity.ts'],
})
