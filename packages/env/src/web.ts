import { createEnv } from "@t3-oss/env-core";

const runtimeEnv = (
	import.meta as ImportMeta & { env: Record<string, string | undefined> }
).env;

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {},
	runtimeEnv,
	emptyStringAsUndefined: true,
});
