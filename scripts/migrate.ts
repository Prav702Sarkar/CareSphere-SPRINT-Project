import { Client } from 'pg'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql')
  const sql = fs.readFileSync(sqlPath, 'utf8')

  const hosts = [
    'aws-0-ap-south-1.pooler.supabase.com',
    'aws-0-us-east-1.pooler.supabase.com',
    'aws-0-eu-central-1.pooler.supabase.com',
    'db.bngrfrictoapkkwondak.supabase.co',
  ]

  const passwords = ['mrzAX16yAQmx6cU9']
  const projectId = 'bngrfrictoapkkwondak'

  let connected = false

  for (const host of hosts) {
    for (const pass of passwords) {
      const isPooler = host.includes('pooler')
      const user = isPooler ? `postgres.${projectId}` : 'postgres'
      const port = isPooler ? 6543 : 5432

      console.log(`Connecting to ${host}:${port} as ${user}...`)
      const client = new Client({
        host,
        port,
        user,
        password: pass,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      })

      try {
        await client.connect()
        console.log(`✅ Connected successfully to ${host}! Executing migration...`)
        await client.query(sql)
        console.log('🎉 Migration 001_initial_schema.sql applied successfully!')
        await client.end()
        connected = true
        return
      } catch (err: any) {
        console.log(`❌ Failed on ${host}: ${err.message}`)
        try { await client.end() } catch {}
      }
    }
  }

  if (!connected) {
    console.error('Could not connect to any Supabase host directly.')
  }
}

runMigration()
