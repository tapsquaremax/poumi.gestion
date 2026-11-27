
import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'

config({ path: '.dev.vars' })

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('No se encontró DATABASE_URL en .dev.vars')
}

const client = neon(databaseUrl)
const db = drizzle({ client })

try {
  console.log('Iniciando migraciones de POUMI...')

  await migrate(db, {
    migrationsFolder: './drizzle',
  })

  console.log('¡Migraciones aplicadas correctamente!')
} catch (error) {
  console.error('Error al aplicar las migraciones:', error)
  process.exitCode = 1
}
