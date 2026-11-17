import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const isDev = process.env.NODE_ENV !== "production";

// vitePluginManusRuntime and jsxLocPlugin are dev-only tooling: the former
// bloats HTML by ~360KB in production, the latter stamps every element with
// a data-loc="path/to/File.tsx:N" attribute that leaks source file paths and
// bloats output for no benefit once there's no editor on the other end to use it.
const plugins = [react(), tailwindcss(), ...(isDev ? [jsxLocPlugin(), vitePluginManusRuntime()] : [])];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React/react-dom almost never change between deploys, unlike app
          // code — splitting them out means a redeploy only invalidates the
          // (much smaller) app chunk's cache, not this one too.
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
