import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Enable minification for smaller bundle sizes
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Split CSS into separate files for better caching and parallel downloads
    cssCodeSplit: true,
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries into their own chunks
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "redux-vendor": ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          "ui-vendor": ["@chatscope/chat-ui-kit-react"],
          "motion-vendor": ["framer-motion"],
          "markdown-vendor": [
            "react-markdown",
            "rehype-katex",
            "rehype-sanitize",
            "remark-gfm",
            "remark-math",
          ],
          "utils-vendor": [
            "axios",
            "react-toastify",
            "react-icons",
            "@emailjs/browser",
            "katex",
          ],
        },
      },
    },
    // Output file size warnings for chunks larger than 500kB
    chunkSizeWarningLimit: 500,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
    ],
  },
});
