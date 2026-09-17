// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.atlantacare.com',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
  vite: { server: { watch: { ignored: ['**/tina/__generated__/**', '**/public/tina-admin/**'] } } },
});
