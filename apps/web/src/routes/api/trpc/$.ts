import { createFileRoute } from "@tanstack/react-router";

async function handler({ request }: { request: Request }) {
	const { createContext } = await import("@kabut-tipis/api/context");
	const { appRouter } = await import("@kabut-tipis/api/routers/index");
	const { fetchRequestHandler } = await import(
		"@trpc/server/adapters/fetch"
	);
	return fetchRequestHandler({
		req: request,
		router: appRouter,
		createContext,
		endpoint: "/api/trpc",
	});
}

export const Route = createFileRoute("/api/trpc/$")({
	server: {
		handlers: {
			GET: handler,
			POST: handler,
		},
	},
});
