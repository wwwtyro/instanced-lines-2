// vite.config.js
const { defineConfig } = require("vite");

module.exports = defineConfig({
  base: "/instanced-lines-2/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
