import type { AppRouter } from "@kabut-tipis/api/routers/index";
import { Toaster } from "@kabut-tipis/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

import Footer from "../components/layout/footer";
import Navbar from "../components/layout/navbar";

import appCss from "../index.css?url";
export interface RouterAppContext {
	trpc: TRPCOptionsProxy<AppRouter>;
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Kabut Tipis",
			},
			{
				name: "description",
				content:
					"Kabut Tipis adalah tempat rekreasi, coffeeshop, dan penginapan dengan pemandangan gunung, sawah, dan aliran sungai.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="id">
			<head>
				<HeadContent />
			</head>
			<body>
				<div className="min-h-screen overflow-x-hidden bg-background text-foreground antialiased">
					<Navbar />
					<main className="relative z-10 min-h-screen bg-background">
						<Outlet />
					</main>
					<Footer />
				</div>
				<Toaster richColors />
				{import.meta.env.DEV ? (
					<>
						<TanStackRouterDevtools position="bottom-left" />
						<ReactQueryDevtools
							position="bottom"
							buttonPosition="bottom-right"
						/>
					</>
				) : null}
				<Scripts />
			</body>
		</html>
	);
}
