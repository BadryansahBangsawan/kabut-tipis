import { createDb } from "@kabut-tipis/db";

export async function createContext({ req }: { req: Request }) {
	return {
		auth: null,
		db: createDb(),
		req,
		session: null,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
