import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

config({ path: "../../apps/web/.env" });

const client = createClient({
	url: process.env.DATABASE_URL!,
	authToken: process.env.DATABASE_AUTH_TOKEN,
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
			title: "Pemandangan Alam Kabut Tipis",
			description: "Suasana alam hijau dari area utama",
			url: "/kabut-tipis-asset/foto/1.png",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 1,
		},
		{
			id: "gal-2",
			title: "Area Rekreasi",
			description: "Spot favorit pengunjung",
			url: "/kabut-tipis-asset/foto/2.png",
			thumbnailUrl: null,
			type: "photo",
			category: "rekreasi",
			sortOrder: 2,
		},
		{
			id: "gal-3",
			title: "Area Coffeeshop",
			description: "Suasana coffeeshop dengan view alam",
			url: "/kabut-tipis-asset/foto/3.png",
			thumbnailUrl: null,
			type: "photo",
			category: "coffeeshop",
			sortOrder: 3,
		},
		{
			id: "gal-4",
			title: "Suasana Penginapan",
			description: "Area glamping dan penginapan",
			url: "/kabut-tipis-asset/foto/4.png",
			thumbnailUrl: null,
			type: "photo",
			category: "penginapan",
			sortOrder: 4,
		},
	]);

	console.log("✓ Seed selesai");
	process.exit(0);
}

seed().catch((e) => {
	console.error("Seed gagal:", e);
	process.exit(1);
});
