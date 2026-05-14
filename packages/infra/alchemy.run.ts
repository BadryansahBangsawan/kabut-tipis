import alchemy from "alchemy";
import { TanStackStart } from "alchemy/cloudflare";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });
config({ path: "../../apps/web/.env.production", override: true });

const app = await alchemy("kabut-tipis");

export const web = await TanStackStart("web", {
	cwd: "../../apps/web",
	bindings: {
		DATABASE_URL: alchemy.secret.env.DATABASE_URL!,
		DATABASE_AUTH_TOKEN: alchemy.secret.env.DATABASE_AUTH_TOKEN!,
		CORS_ORIGIN: alchemy.env.CORS_ORIGIN!,
	},
});

console.log(`Web    -> ${web.url}`);

await app.finalize();
