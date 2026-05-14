import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config } from "dotenv";

const currentDir = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(currentDir, "../../../.env") });
config();

const runtimeEnv = typeof process === "undefined" ? {} : process.env;

export const env = new Proxy({} as Env, {
	get(_target, prop) {
		if (typeof prop !== "string") {
			return undefined;
		}

		return runtimeEnv[prop];
	},
});
