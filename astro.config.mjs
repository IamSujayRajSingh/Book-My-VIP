import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { loadEnv } from "vite";

const settings = loadEnv(
  process.env.NODE_ENV || "production",
  process.cwd(),
  "PUBLIC_",
);
const origin = process.env.PUBLIC_SITE_URL || settings.PUBLIC_SITE_URL;
if (origin) {
  const url = new URL(origin);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  ) {
    throw new Error(
      "PUBLIC_SITE_URL must be a verified HTTPS origin without a path.",
    );
  }
}

export default defineConfig({
  output: "static",
  site: origin || undefined,
  trailingSlash: "always",
  devToolbar: { enabled: false },
  integrations: origin
    ? [sitemap({ filter: (url) => !url.endsWith("/404/") })]
    : [],
});
