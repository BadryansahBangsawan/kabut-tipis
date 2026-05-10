import { reservations, tourPackages } from "@kabut-tipis/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { publicProcedure, router } from "../index";

const phoneSchema = z
	.string()
	.regex(/^(08|62|\+62)\d{8,13}$/, "Nomor WhatsApp tidak valid");

const createReservationInput = z.object({
	name: z.string().trim().min(3),
	phone: phoneSchema,
	date: z.string().min(1),
	guestCount: z.number().int().min(1).max(100),
	packageId: z.string().min(1),
	notes: z.string().trim().max(500).optional(),
});

export const reservationRouter = router({
	create: publicProcedure
		.input(createReservationInput)
		.mutation(async ({ ctx, input }) => {
			const [selectedPackage] = await ctx.db
				.select()
				.from(tourPackages)
				.where(eq(tourPackages.id, input.packageId))
				.limit(1);

			if (!selectedPackage?.isActive) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Paket reservasi tidak ditemukan",
				});
			}

			const reservation = {
				id: crypto.randomUUID(),
				name: input.name,
				phone: input.phone,
				date: input.date,
				guestCount: input.guestCount,
				packageId: input.packageId,
				notes: input.notes || null,
				status: "pending" as const,
			};

			await ctx.db.insert(reservations).values(reservation);

			return {
				...reservation,
				packageName: selectedPackage.name,
				packagePrice: selectedPackage.price,
			};
		}),
});
