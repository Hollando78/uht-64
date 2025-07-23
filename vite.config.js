import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/uht-64/',  // 👈 Very important for GitHub Pages
});
