import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const tourPackages = sqliteTable("packages", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	price: integer("price").notNull(),
	duration: text("duration").notNull(),
	features: text("features").notNull(),
	isFeatured: integer("is_featured", { mode: "boolean" })
		.notNull()
		.default(false),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export type TourPackage = typeof tourPackages.$inferSelect;
export type NewTourPackage = typeof tourPackages.$inferInsert;
