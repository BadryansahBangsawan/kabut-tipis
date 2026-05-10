import type { AppRouter } from "@kabut-tipis/api/routers/index";
import { Toaster } from "@kabut-tipis/ui/components/sonner";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
	useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { AnimatePresence, motion } from "framer-motion";

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
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Kabut Tipis" },
			{
				name: "description",
				content:
					"Kabut Tipis adalah tempat rekreasi, coffeeshop, dan penginapan dengan pemandangan gunung, sawah, dan aliran sungai.",
			},
			// Open Graph
			{ property: "og:type", content: "website" },
			{ property: "og:site_name", content: "Kabut Tipis" },
			{ property: "og:title", content: "Kabut Tipis" },
			{
				property: "og:description",
				content:
					"Tempat rekreasi, coffeeshop, dan penginapan dengan pemandangan gunung, sawah, dan aliran sungai.",
			},
			{
				property: "og:image",
				content:
					"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1200&auto=format&fit=crop",
			},
			// Twitter
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: "Kabut Tipis" },
			{
				name: "twitter:description",
				content:
					"Tempat rekreasi, coffeeshop, dan penginapan dengan pemandangan gunung, sawah, dan aliran sungai.",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),

	component: RootDocument,
});

function AnimatedOutlet() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });

	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				key={pathname}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -6 }}
				initial={{ opacity: 0, y: 6 }}
				transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
			>
				<Outlet />
			</motion.div>
		</AnimatePresence>
	);
}

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
						<AnimatedOutlet />
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
