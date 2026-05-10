import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

const client = createClient({
	url: process.env.DATABASE_URL ?? "file:/Users/bbbadry/Downloads/kabut-tipis/local.db",
});

const db = drizzle({ client, schema });

async function seed() {
	// ── Packages ──────────────────────────────────────────────────────────────
	await db.delete(schema.tourPackages);

	await db.insert(schema.tourPackages).values([
		{
			id: "pkg-rekreasi",
			name: "Rekreasi Harian",
			description: "Nikmati alam Kabut Tipis seharian penuh",
			price: 35000,
			duration: "per orang",
			features: JSON.stringify([
				"Akses area rekreasi penuh",
				"Parkir gratis",
				"Toilet bersih",
				"Area foto",
				"Jalur wisata alam",
			]),
			isFeatured: false,
			isActive: true,
			sortOrder: 1,
		},
		{
			id: "pkg-meja",
			name: "Meja Keluarga",
			description: "Paket meja lesehan untuk keluarga atau rombongan kecil",
			price: 150000,
			duration: "per meja (4 orang)",
			features: [
				"Meja & kursi lesehan premium",
				"Akses area rekreasi",
				"1x minuman hangat per orang",
				"Pemandangan gunung & sawah",
				"Reservasi prioritas",
			].join("|"),
			isFeatured: true,
			isActive: true,
			sortOrder: 2,
		},
		{
			id: "pkg-camping",
			name: "Camping Santai",
			description: "Berkemah di tengah alam dengan fasilitas lengkap",
			price: 200000,
			duration: "per malam",
			features: JSON.stringify([
				"Tenda dome 2–3 orang",
				"Sleeping bag & matras",
				"Api unggun",
				"Sarapan pagi",
				"Pemandu wisata",
			]),
			isFeatured: false,
			isActive: true,
			sortOrder: 3,
		},
		{
			id: "pkg-staycation",
			name: "Staycation",
			description: "Menginap dengan pemandangan alam yang memukau",
			price: 450000,
			duration: "per malam",
			features: JSON.stringify([
				"Kamar privat dengan view alam",
				"Sarapan & makan malam",
				"Akses semua fasilitas",
				"WiFi gratis",
				"Check-in 14.00 / Check-out 12.00",
			]),
			isFeatured: false,
			isActive: true,
			sortOrder: 4,
		},
	]);

	// ── Gallery ───────────────────────────────────────────────────────────────
	await db.delete(schema.galleryItems);

	await db.insert(schema.galleryItems).values([
		{
			id: "gal-1",
			title: "Pemandangan Gunung",
			description: "Silhuet gunung di pagi hari",
			url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 1,
		},
		{
			id: "gal-2",
			title: "Sawah Hijau",
			description: "Hamparan sawah di sekitar area",
			url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 2,
		},
		{
			id: "gal-3",
			title: "Area Coffeeshop",
			description: "Suasana coffeeshop dengan view alam",
			url: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "coffeeshop",
			sortOrder: 3,
		},
		{
			id: "gal-4",
			title: "Meja Lesehan",
			description: "Spot duduk santai menghadap sawah",
			url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "coffeeshop",
			sortOrder: 4,
		},
		{
			id: "gal-5",
			title: "Kamar Penginapan",
			description: "Kamar nyaman dengan pemandangan",
			url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "penginapan",
			sortOrder: 5,
		},
		{
			id: "gal-6",
			title: "Area Camping",
			description: "Tenda di tengah alam terbuka",
			url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 6,
		},
		{
			id: "gal-7",
			title: "Aliran Sungai",
			description: "Gemericik air sungai yang menenangkan",
			url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 7,
		},
		{
			id: "gal-8",
			title: "Kopi Pagi",
			description: "Secangkir kopi hangat di pagi hari",
			url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "coffeeshop",
			sortOrder: 8,
		},
		{
			id: "gal-9",
			title: "Sunrise View",
			description: "Momen matahari terbit dari area utama",
			url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 9,
		},
	]);

	console.log("✓ Seed selesai");
	process.exit(0);
}

seed().catch((e) => {
	console.error("Seed gagal:", e);
	process.exit(1);
});
