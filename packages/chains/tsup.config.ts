import { defineConfig } from 'tsup'

export default defineConfig({
  name: '@superchain-testnet-tools/chains',
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
})
