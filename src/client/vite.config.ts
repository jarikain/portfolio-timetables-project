import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    {
      name: 'handle-theme-link',
      transformIndexHtml(html) {
        // Remove any existing theme link with empty href
        html = html.replace(/<link id="theme-link"[^>]*href=""[^>]*>/, '');

        // Find the existing stylesheet link and add the id if it doesn't have one
        return html.replace(
          /<link rel="stylesheet"([^>]*)>/,
          (match, p1) => {
            if (match.indexOf('id="theme-link"') >= 0) {
              return match;
            }
            return `<link id="theme-link" rel="stylesheet"${p1}>`;
          }
        );
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
