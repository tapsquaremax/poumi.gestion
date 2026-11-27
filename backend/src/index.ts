
import { Hono } from 'hono'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'

type Bindings = {
  DATABASE_URL: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.text('POUMI Backend funcionando!')
})

app.get('/api/health', async (c) => {
  try {
    const client = neon(c.env.DATABASE_URL)
    const db = drizzle({ client })

    await db.execute(sql`SELECT 1`)

    return c.json({
      status: 'ok',
      application: 'POUMI',
      database: 'connected',
      message: 'Conexión con Neon exitosa',
    })
  } catch (error) {
    console.error('Error de conexión con Neon:', error)

    return c.json(
      {
        status: 'error',
        application: 'POUMI',
        database: 'disconnected',
        message: 'No se pudo conectar con la base de datos',
      },
      500
    )
  }
})

export default app
