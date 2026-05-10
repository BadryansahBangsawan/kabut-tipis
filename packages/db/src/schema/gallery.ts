import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const galleryItems = sqliteTable("gallery_items", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	url: text("url").notNull(),
	thumbnailUrl: text("thumbnail_url"),
	type: text("type", { enum: ["photo", "video"] }).notNull(),
	category: text("category").notNull(),
	sortOrder: integer("sort_order").notNull().default(0),
	createdAt: integer("created_at", { mode: "timestamp_ms" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;
