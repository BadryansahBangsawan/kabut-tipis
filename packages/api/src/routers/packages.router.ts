import { tourPackages } from "@kabut-tipis/db/schema";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

function parseFeatures(features: string) {
	try {
		const parsed: unknown = JSON.parse(features);

		if (
			Array.isArray(parsed) &&
			parsed.every((item) => typeof item === "string")
		) {
			return parsed;
		}
	} catch {
		return [];
	}

	return [];
}

export const packagesRouter = router({
	list: publicProcedure.query(async ({ ctx }) => {
		const rows = await ctx.db
			.select()
			.from(tourPackages)
			.where(eq(tourPackages.isActive, true))
			.orderBy(asc(tourPackages.sortOrder));

		return rows.map((item) => ({
			...item,
			features: parseFeatures(item.features),
		}));
	}),
	getById: publicProcedure
		.input(z.object({ id: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const [item] = await ctx.db
				.select()
				.from(tourPackages)
				.where(eq(tourPackages.id, input.id))
				.limit(1);

			if (!item?.isActive) {
				return null;
			}

			return {
				...item,
				features: parseFeatures(item.features),
			};
		}),
});
