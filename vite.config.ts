import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

// Library build: bundles src/index.ts to dist/index.js (ESM) + dist/index.d.ts.
// Everything imported from node_modules (react, radix-ui, @tabler/icons-react,
// @tanstack/react-table, date-fns, react-day-picker, clsx, tailwind-merge,
// class-variance-authority) is externalized — the consumer's own node_modules
// resolves them via this package's dependencies/peerDependencies, so dist stays
// small and there is exactly one copy of each in the consumer's bundle.
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.test.{ts,tsx}', 'src/test-setup.ts'],
    }),
  ],
  // `public/r/*` is the shadcn registry's static JSON output (served straight from the
  // repo, not through npm) — keep it out of the package's dist/.
  publicDir: false,
  resolve: {
    alias: [
      // Shadcn-registry alias the component sources still use, mapped to their real
      // location — listed before the general `@` alias so it wins.
      { find: /^@\/components\/ui\/(.*)$/, replacement: fileURLToPath(new URL('./src/ui/$1', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'index.js',
    },
    rollupOptions: {
      external: (id) =>
        !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('@/') && !id.startsWith('\0'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
