import { publicProcedure, router } from "../index";
import { galleryRouter } from "./gallery.router";
import { packagesRouter } from "./packages.router";
import { reservationRouter } from "./reservation.router";

export const appRouter = router({
	gallery: galleryRouter,
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	packages: packagesRouter,
	reservation: reservationRouter,
});
export type AppRouter = typeof appRouter;
