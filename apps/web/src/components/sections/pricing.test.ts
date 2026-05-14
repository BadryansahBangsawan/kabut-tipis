import { describe, expect, test } from "bun:test";

import { RESERVATION_PACKAGE_IDS } from "./pricing.data";

describe("pricing reservation links", () => {
	test("uses package ids that exist in the seeded reservation database", () => {
		expect(RESERVATION_PACKAGE_IDS).toEqual({
			glampingEmbun: "pkg-staycation",
			tiketMasuk: "pkg-rekreasi",
			glampingKawa: "pkg-camping",
			grillChill: "pkg-meja",
		});
	});
});
