import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/* GitHub Pages serves the site from /<repo>/, so a production build
   needs that prefix on its asset URLs. Dev stays at the root. */
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/erastour_piano/" : "/",
  plugins: [react()],
  server: { open: true },
}));
