import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { tourPackages } from "./packages";

export const reservations = sqliteTable("reservations", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	phone: text("phone").notNull(),
	date: text("date").notNull(),
	guestCount: integer("guest_count").notNull(),
	packageId: text("package_id")
		.notNull()
		.references(() => tourPackages.id),
	notes: text("notes"),
	status: text("status", { enum: ["pending", "confirmed", "cancelled"] })
		.notNull()
		.default("pending"),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export type Reservation = typeof reservations.$inferSelect;
export type NewReservation = typeof reservations.$inferInsert;
