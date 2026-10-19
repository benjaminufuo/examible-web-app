import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// PWA: the installable app shell. Service worker rules:
// - precache only the app itself (code, styles, fonts, icons), never images:
//   the worker installs for every website visitor, so precaching ~6 MB of PNGs
//   would silently spend students' mobile data
// - never cache API responses: the worker can't tell students apart
// Kill switch: set VITE_PWA_KILL_SWITCH=true on Vercel and redeploy. Every
// device then unregisters the service worker and clears its caches on its next
// visit. Remove the variable and redeploy to bring the PWA back.
const pwa = (killSwitch) =>
  VitePWA({
    registerType: "prompt",
    injectRegister: false, // registered in AppUpdater
    selfDestroying: killSwitch,
    includeAssets: ["favicon.png", "icons/apple-touch-icon-180x180.png"],
    manifest: {
      name: "Examible",
      short_name: "Examible",
      description: "Past questions, CBT practice and AI explanations for JAMB.",
      id: "/",
      start_url: "/overview?source=pwa",
      scope: "/",
      display: "standalone",
      orientation: "portrait",
      theme_color: "#08080d", // the dark --ex-bg
      background_color: "#08080d",
      icons: [
        { src: "/icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
        {
          src: "/icons/maskable-icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
      shortcuts: [
        {
          name: "Past questions",
          url: "/past-questions?source=pwa-shortcut",
          icons: [
            {
              src: "/icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        },
        {
          name: "CBT practice",
          url: "/cbt-mode?source=pwa-shortcut",
          icons: [
            {
              src: "/icons/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        },
      ],
      // The richer install sheet: "narrow" for phones (Android), "wide" for
      // desktop. Screenshots of one form factor must share a size.
      screenshots: [
        {
          src: "/screenshots/overview.png",
          sizes: "485x953",
          type: "image/png",
          form_factor: "narrow",
          label: "Action Center: CBT simulator, past questions and quick practice",
        },
        {
          src: "/screenshots/cbt-question.png",
          sizes: "485x953",
          type: "image/png",
          form_factor: "narrow",
          label: "A timed JAMB CBT question with maths",
        },
        // Desktop install dialog (Chrome and Edge)
        {
          src: "/screenshots/desktop-overview.webp",
          sizes: "1926x1193",
          type: "image/webp",
          form_factor: "wide",
          label: "Dashboard: action center, readiness and AI insights",
        },
        {
          src: "/screenshots/desktop-cbt-question.webp",
          sizes: "1926x1193",
          type: "image/webp",
          form_factor: "wide",
          label: "A timed JAMB CBT question with the question navigator",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,woff2,ico}"],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      navigateFallback: "/index.html",
      navigateFallbackDenylist: [
        /^\/api\//,
        /^\/robots\.txt$/,
        /^\/sitemap\.xml$/,
      ],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          // Our own images, cached only once a student has actually seen them
          urlPattern: ({ request, sameOrigin }) =>
            sameOrigin && request.destination === "image",
          handler: "CacheFirst",
          options: {
            cacheName: "images",
            expiration: { maxEntries: 80, maxAgeSeconds: 30 * 24 * 60 * 60 },
          },
        },
        // No API caching, ever. Question images (Cloudinary) are cached in Phase 2.
      ],
    },
    devOptions: { enabled: false },
  });

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), pwa(env.VITE_PWA_KILL_SWITCH === "true")],
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
            "redux-vendor": [
              "@reduxjs/toolkit",
              "react-redux",
              "redux-persist",
            ],
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
  };
});
