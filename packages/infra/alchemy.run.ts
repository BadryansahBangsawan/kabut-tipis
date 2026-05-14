import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/web/.env.production", override: true });

const app = await alchemy("kabut-tipis");

function requiredEnv<T>(value: T | undefined, name: string): T {
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		DATABASE_URL: requiredEnv(process.env.DATABASE_URL, "DATABASE_URL"),
		DATABASE_AUTH_TOKEN: requiredEnv(
			alchemy.secret.env.DATABASE_AUTH_TOKEN,
			"DATABASE_AUTH_TOKEN",
		),
		CORS_ORIGIN: requiredEnv(alchemy.env.CORS_ORIGIN, "CORS_ORIGIN"),
	},
	wrangler: {
		secrets: false,
	},
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
