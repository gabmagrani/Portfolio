import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the built assets resolve whether the site is served
  // from a project page (username.github.io/Portfolio/) or a root domain.
  base: "./",
  plugins: [react()],
});
