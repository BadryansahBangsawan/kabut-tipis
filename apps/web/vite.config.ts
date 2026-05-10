import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import alchemy from "alchemy/cloudflare/tanstack-start";
import { defineConfig } from "vite";

const alchemyConfigPath = fileURLToPath(
	new URL("./.alchemy/local/wrangler.jsonc", import.meta.url),
);

// Workerd (Cloudflare Workers) cannot access the local filesystem,
// so file: database URLs are incompatible. Skip alchemy in that case
// and fall back to Node.js/Bun runtime for local dev.
const envPath = fileURLToPath(new URL("./.env", import.meta.url));
const isLocalFileDb = existsSync(envPath) &&
	/^DATABASE_URL=file:/m.test(readFileSync(envPath, "utf-8"));
const shouldUseAlchemy = existsSync(alchemyConfigPath) && !isLocalFileDb;
const cloudflareWorkersShimPath = fileURLToPath(
	new URL("../../packages/env/src/cloudflare-local.ts", import.meta.url),
);
const cloudflareWorkersAlias: Record<string, string> = shouldUseAlchemy
	? {}
	: {
			"cloudflare:workers": cloudflareWorkersShimPath,
		};

export default defineConfig({
	server: {
		port: 3001,
	},
	resolve: {
		tsconfigPaths: true,
		alias: cloudflareWorkersAlias,
	},
	plugins: [
		tailwindcss(),
		tanstackStart(),
		viteReact(),
		...(shouldUseAlchemy ? [alchemy({ configPath: alchemyConfigPath })] : []),
	],
});
