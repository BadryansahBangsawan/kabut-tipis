import type { AppRouter } from "@kabut-tipis/api/routers/index";
import { QueryCache, QueryClient } from "@tanstack/react-query";

import "./index.css";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";

import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import { TRPCProvider } from "./utils/trpc";

function createQueryClient() {
	return new QueryClient({
		queryCache: new QueryCache({
			onError: (error, query) => {
				if (typeof window === "undefined") return;

				toast.error(error.message, {
					action: {
						label: "retry",
						onClick: query.invalidate,
					},
				});
			},
		}),
		defaultOptions: { queries: { staleTime: 60 * 1000 } },
	});
}

function getBaseUrl() {
	if (typeof window !== "undefined") return ""; // browser: pakai relative URL
	const configuredUrl = import.meta.env.VITE_APP_URL;

	if (configuredUrl && !configuredUrl.includes("localhost")) {
		return configuredUrl;
	}

	// SSR on Cloudflare Workers needs an absolute URL. Localhost only exists in dev.
	return import.meta.env.PROD
		? "https://kabuttipis.badry.asia"
		: (configuredUrl ?? "http://localhost:3001");
}

export const getRouter = () => {
	const queryClient = createQueryClient();
	const trpcClient = createTRPCClient<AppRouter>({
		links: [
			httpBatchLink({
				url: `${getBaseUrl()}/api/trpc`,
			}),
		],
	});
	const trpc = createTRPCOptionsProxy({
		client: trpcClient,
		queryClient,
	});

	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		context: { trpc, queryClient },
		defaultPendingComponent: () => <Loader />,
		defaultNotFoundComponent: () => <div>Not Found</div>,
		Wrap: ({ children }) => (
			<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
				{children}
			</TRPCProvider>
		),
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient,
	});

	return router;
};

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
