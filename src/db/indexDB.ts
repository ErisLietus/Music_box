import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import "dotenv/config"


const pool = new Pool({
  connectionString: envOrThrow("DATABASE_URL")
})

export const db = drizzle({ client: pool} )

export function envOrThrow(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}