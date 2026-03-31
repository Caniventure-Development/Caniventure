import { env } from 'node:process'
import { Migrator } from '@mikro-orm/migrations'
import {
  DataloaderType,
  defineConfig,
  MemoryCacheAdapter,
} from '@mikro-orm/postgresql'
import { SeedManager } from '@mikro-orm/seeder'
import { SqlHighlighter } from '@mikro-orm/sql-highlighter'
import { Time } from '@sapphire/timestamp'
import 'dotenv/config'

const isDevelopment =
  (env.NODE_ENV ?? 'production').toLowerCase() === 'development'
const fileGlob = '!(*.d).{js,ts}'

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
  debug: isDevelopment,
  // The line below is not really gonna be used, but don't remove it.
  // Otherwise MikroORM is gonna complain.
  entities: ['./dist/entities/**/*.entity.js'],
  entitiesTs: ['./entities/**/*.entity.ts'],
  extensions: [Migrator, SeedManager],
  resultCache: {
    adapter: MemoryCacheAdapter,
    expiration: Time.Second * 3,
    global: true, // Enable the cache globally and set it to our expiration time
  },
  dataloader: DataloaderType.ALL,
  highlighter: isDevelopment ? new SqlHighlighter() : undefined,
  migrations: {
    path: './dist/migrations/',
    pathTs: './src/migrations/',
    glob: fileGlob,
  },
  seeder: {
    path: './dist/seeders/',
    pathTs: './src/seeders/',
    glob: fileGlob,
  },
})
