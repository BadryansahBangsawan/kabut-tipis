import { describe, expect, test } from "bun:test";

import {
	createReservationInput,
	createReservationSignature,
	getLocalDateKey,
} from "./reservation.validation";

describe("reservation validation", () => {
	test("rejects reservation dates in the past on the server", () => {
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const date = getLocalDateKey(yesterday);

		const result = createReservationInput.safeParse({
			name: "Budi Santoso",
			phone: "081234567890",
			date,
			guestCount: 2,
			packageId: "pkg-camping",
		});

		expect(result.success).toBe(false);
	});

	test("rejects impossible date strings", () => {
		const result = createReservationInput.safeParse({
			name: "Budi Santoso",
			phone: "081234567890",
			date: "2026-02-31",
			guestCount: 2,
			packageId: "pkg-camping",
		});

		expect(result.success).toBe(false);
	});

	test("normalizes duplicate reservation signatures", () => {
		expect(
			createReservationSignature({
				phone: "+6281234567890",
				date: "2026-06-01",
				packageId: "pkg-camping",
			}),
		).toBe(
			createReservationSignature({
				phone: "081234567890",
				date: "2026-06-01",
				packageId: "pkg-camping",
			}),
		);
	});
});
