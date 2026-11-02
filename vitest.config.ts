import path from 'node:path';
import { defineConfig } from 'vitest/config';

for (const file of ['.env.local', '.env']) {
  try {
    process.loadEnvFile(file);
  } catch { /* Optional local env files may be absent. */ }
}

export default defineConfig({
  test: {
    environment: 'node',
    env: process.env as Record<string, string>,
    globals: true,
    include: ['tests/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
