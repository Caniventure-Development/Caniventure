import { env } from 'node:process'
import { defineConfig, MemoryCacheAdapter } from '@mikro-orm/postgresql'
import { TsMorphMetadataProvider } from '@mikro-orm/reflection'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { Time } from '@sapphire/timestamp'
import 'dotenv/config' // eslint-disable-line import-x/no-unassigned-import

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
  resultCache: {
    adapter: MemoryCacheAdapter,
    expiration: Time.Minute * 2.5,
    global: Time.Second * 5,
  },
  highlighter: new SqlHighlighter(),
})
