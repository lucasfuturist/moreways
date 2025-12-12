import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // FIX: Don't exclude the whole 'src/tests' folder.
    // Instead, only exclude Playwright's ".spec.ts" files.
    exclude: [...configDefaults.exclude, '**/*.spec.ts'],
    
    // Include any file ending in .test.ts or .test.tsx
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});