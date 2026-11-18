import { defineConfig } from 'drizzle-kit';

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file);
  } catch { /* Optional local env files may be absent. */ }
}

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL is required');
}

export default defineConfig({
  schema: './db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});
