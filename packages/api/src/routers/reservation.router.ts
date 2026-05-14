import { reservations, tourPackages } from "@kabut-tipis/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, gte, or } from "drizzle-orm";

import { publicProcedure, router } from "../index";
import {
	checkReservationRateLimit,
	createReservationInput,
	normalizeReservationPhone,
	RESERVATION_DEDUP_WINDOW_MS,
} from "./reservation.validation";

export const reservationRouter = router({
	create: publicProcedure
		.input(createReservationInput)
		.mutation(async ({ ctx, input }) => {
			const rateLimit = checkReservationRateLimit(ctx.req);

			if (!rateLimit.allowed) {
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: `Terlalu banyak percobaan reservasi. Coba lagi dalam ${rateLimit.retryAfterSeconds} detik.`,
				});
			}

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

			const normalizedPhone = normalizeReservationPhone(input.phone);
			const duplicateWindowStart = new Date(
				Date.now() - RESERVATION_DEDUP_WINDOW_MS,
			);
			const [duplicateReservation] = await ctx.db
				.select({ id: reservations.id })
				.from(reservations)
				.where(
					and(
						or(
							eq(reservations.phone, normalizedPhone),
							eq(reservations.phone, input.phone),
						),
						eq(reservations.date, input.date),
						eq(reservations.packageId, input.packageId),
						gte(reservations.createdAt, duplicateWindowStart),
					),
				)
				.limit(1);

			if (duplicateReservation) {
				throw new TRPCError({
					code: "CONFLICT",
					message:
						"Reservasi serupa sudah masuk. Silakan tunggu konfirmasi atau ubah detail reservasi.",
				});
			}

			const reservation = {
				id: crypto.randomUUID(),
				name: input.name,
				phone: normalizedPhone,
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
