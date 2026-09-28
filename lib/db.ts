import { Pool } from 'pg'

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://acc:acc@localhost:5432/acc_dashboard'

declare global {
  var __accPgPool: Pool | undefined
}

function createPool(): Pool {
  return new Pool({
    connectionString,
    max: 10,
  })
}

export const pool: Pool = global.__accPgPool ?? createPool()

if (process.env.NODE_ENV !== 'production') {
  global.__accPgPool = pool
}
