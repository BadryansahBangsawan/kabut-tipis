import { galleryItems } from "@kabut-tipis/db/schema";
import { and, asc, eq, type SQL } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

const galleryListInput = z
	.object({
		category: z.string().min(1).optional(),
		type: z.enum(["photo", "video"]).optional(),
	})
	.optional();

export const galleryRouter = router({
	list: publicProcedure
		.input(galleryListInput)
		.query(async ({ ctx, input }) => {
			const filters: SQL[] = [];

			if (input?.category) {
				filters.push(eq(galleryItems.category, input.category));
			}

			if (input?.type) {
				filters.push(eq(galleryItems.type, input.type));
			}

			return ctx.db
				.select()
				.from(galleryItems)
				.where(filters.length > 0 ? and(...filters) : undefined)
				.orderBy(asc(galleryItems.sortOrder));
		}),
});
