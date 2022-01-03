export default defineConfig({
  server: {
    proxy: {
      // string shorthand
      '/api': 'http://localhost:8389'
    }
  }
});
