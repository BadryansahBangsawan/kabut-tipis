import { Badge } from "@kabut-tipis/ui/components/badge";
import { buttonVariants } from "@kabut-tipis/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@kabut-tipis/ui/components/card";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
	Check,
	ChevronDown,
	Coffee,
	Home,
	MapPin,
	MessageCircle,
	Minus,
	Mountain,
	ParkingCircle,
	Phone,
	Sparkles,
	Tent,
	Wifi,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/services")({
	component: ServicesPage,
});

// ─── Static data (mirrors plan/price-section content) ──────────────────────
const packages = [
	{
		id: "rekreasi-harian",
		name: "Rekreasi Harian",
		badge: "Populer",
		description: "Paket santai untuk menikmati area alam dan coffeeshop.",
		price: "Rp25.000",
		duration: "per orang",
		featured: true,
		features: [
			"Akses area rekreasi",
			"Spot foto sawah dan gunung",
			"Voucher minuman pilihan",
			"Reservasi meja via WhatsApp",
		],
	},
	{
		id: "meja-keluarga",
		name: "Meja Keluarga",
		badge: "Keluarga",
		description: "Area duduk lebih lega untuk kunjungan keluarga kecil.",
		price: "Rp120.000",
		duration: "per grup",
		featured: false,
		features: ["Kapasitas 4-6 tamu", "Meja prioritas", "Area dekat view utama"],
	},
	{
		id: "camping-santai",
		name: "Camping Santai",
		badge: "Outdoor",
		description: "Pengalaman bermalam sederhana di area alam.",
		price: "Rp180.000",
		duration: "per malam",
		featured: false,
		features: ["Area tenda", "Akses toilet", "Pagi dengan view sawah"],
	},
	{
		id: "staycation",
		name: "Staycation",
		badge: "Menginap",
		description: "Paket menginap untuk rehat lebih lama di Kabut Tipis.",
		price: "Rp350.000",
		duration: "per malam",
		featured: false,
		features: ["Kamar privat", "Sarapan ringan", "Akses area rekreasi"],
	},
];

const facilities = [
	{ icon: Wifi, label: "WiFi Gratis", desc: "Di area coffeeshop" },
	{ icon: ParkingCircle, label: "Parkir Luas", desc: "Motor & mobil" },
	{ icon: Coffee, label: "Coffeeshop", desc: "Menu kopi & non-kopi" },
	{ icon: Mountain, label: "View Gunung", desc: "Dari area utama" },
	{ icon: Tent, label: "Area Camping", desc: "Tenda & perlengkapan" },
	{ icon: Home, label: "Penginapan", desc: "Kamar privat" },
	{ icon: Phone, label: "Reservasi WA", desc: "Konfirmasi cepat" },
	{ icon: MapPin, label: "Lokasi Strategis", desc: "Dekat jalur wisata" },
];

const faqs = [
	{
		q: "Apakah bisa reservasi tanpa menginap?",
		a: "Ya. Paket Rekreasi Harian dan Meja Keluarga tidak memerlukan menginap. Kamu cukup reservasi meja atau area via WhatsApp.",
	},
	{
		q: "Berapa kapasitas maksimal per kunjungan?",
		a: "Area rekreasi kami dapat menampung hingga 100 tamu sekaligus. Untuk acara grup besar, hubungi kami terlebih dahulu untuk koordinasi.",
	},
	{
		q: "Apakah ada biaya tambahan selain harga paket?",
		a: "Tidak ada biaya tersembunyi. Harga paket sudah termasuk semua fasilitas yang tertera. Makanan dan minuman tambahan dipesan secara terpisah.",
	},
	{
		q: "Bagaimana cara konfirmasi reservasi?",
		a: "Isi form reservasi di halaman Reservasi, lalu klik tombol 'Konfirmasi via WhatsApp'. Pesan akan otomatis terisi dan tinggal dikirim ke kami.",
	},
	{
		q: "Apakah ada refund jika batal?",
		a: "Pembatalan minimal H-1 dapat diubah ke tanggal lain. Untuk detail kebijakan, hubungi kami langsung via WhatsApp atau telepon.",
	},
	{
		q: "Jam operasional Kabut Tipis?",
		a: "Kami buka setiap hari pukul 08.00 – 22.00 WIB. Untuk tamu penginapan, check-in dimulai pukul 14.00.",
	},
];

// ─── Components ────────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);

	return (
		<div className="border-border border-b last:border-0">
			<button
				className="flex w-full items-center justify-between gap-4 py-4 text-left font-medium text-sm transition-colors hover:text-primary md:text-base"
				onClick={() => setOpen((v) => !v)}
				type="button"
			>
				<span>{q}</span>
				{open ? (
					<Minus className="size-4 shrink-0 text-muted-foreground" />
				) : (
					<ChevronDown className="size-4 shrink-0 text-muted-foreground" />
				)}
			</button>
			<div
				className={cn(
					"overflow-hidden text-muted-foreground text-sm leading-7 transition-all duration-300",
					open ? "max-h-48 pb-4 opacity-100" : "max-h-0 opacity-0",
				)}
			>
				{a}
			</div>
		</div>
	);
}

function ServicesPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<section className="bg-muted px-5 pt-28 pb-16 text-center">
				<div className="mx-auto flex max-w-2xl flex-col gap-4">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Layanan
					</p>
					<h1 className="font-bold text-4xl leading-tight md:text-5xl">
						Semua yang kamu butuhkan di satu tempat.
					</h1>
					<p className="text-muted-foreground text-sm leading-7 md:text-base">
						Dari secangkir kopi hingga bermalam bersama alam — Kabut Tipis
						menyediakan pengalaman yang lengkap.
					</p>
				</div>
			</section>

			{/* Packages */}
			<section className="bg-background px-5 py-20 md:py-28">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
					<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Paket
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Pilih paket yang paling cocok untuk kunjunganmu.
						</h2>
						<p className="text-muted-foreground text-sm leading-7 md:text-base">
							Harga awal dapat disesuaikan dengan jumlah tamu dan kebutuhan
							acara.
						</p>
					</div>

					<div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
						{packages.map((item) => (
							<Card
								key={item.id}
								className={cn(
									"relative bg-background",
									item.featured
										? "lg:col-span-5"
										: "lg:col-span-3 even:lg:col-span-4",
								)}
							>
								{item.featured && (
									<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_38%)]" />
								)}
								<CardHeader className="relative">
									<div className="flex flex-wrap items-center gap-2">
										<Badge variant={item.featured ? "default" : "secondary"}>
											{item.badge}
										</Badge>
										{item.featured && (
											<Badge variant="outline">
												<Sparkles />
												Paling direkomendasikan
											</Badge>
										)}
									</div>
									<CardTitle className="text-2xl">{item.name}</CardTitle>
									<CardDescription>{item.description}</CardDescription>
								</CardHeader>
								<CardContent className="relative flex flex-col gap-6">
									<div className="flex items-end gap-2">
										<span className="font-bold text-4xl">{item.price}</span>
										<span className="pb-1 text-muted-foreground text-sm">
											{item.duration}
										</span>
									</div>
									<ul className="grid gap-3 text-muted-foreground text-sm">
										{item.features.map((f) => (
											<li key={f} className="flex items-center gap-3">
												<span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
													<Check />
												</span>
												<span>{f}</span>
											</li>
										))}
									</ul>
									<a
										className={buttonVariants({
											variant: item.featured ? "default" : "outline",
										})}
										href={`/reservation?paket=${item.id}`}
									>
										Reservasi Sekarang
									</a>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Facilities */}
			<section className="bg-muted px-5 py-20 md:py-28">
				<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
					<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Fasilitas
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Fasilitas lengkap untuk kenyamanan tamu.
						</h2>
					</div>

					<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
						{facilities.map(({ icon: Icon, label, desc }) => (
							<Card
								key={label}
								className="flex flex-col items-center gap-3 p-6"
							>
								<span className="flex size-12 items-center justify-center rounded-full bg-accent">
									<Icon className="size-5 text-primary" />
								</span>
								<div className="text-center">
									<p className="font-semibold text-sm">{label}</p>
									<p className="text-muted-foreground text-xs">{desc}</p>
								</div>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="bg-background px-5 py-20 md:py-28">
				<div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
					<div className="flex flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							FAQ
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Pertanyaan yang sering ditanyakan.
						</h2>
					</div>

					<div className="divide-y-0">
						{faqs.map((faq) => (
							<FaqItem key={faq.q} a={faq.a} q={faq.q} />
						))}
					</div>

					<div className="flex flex-col items-center gap-4 rounded-sm bg-muted p-8 text-center">
						<p className="font-medium">Masih ada pertanyaan lain?</p>
						<p className="text-muted-foreground text-sm">
							Hubungi kami langsung melalui WhatsApp, kami siap membantu.
						</p>
						<a
							className={buttonVariants()}
							href="https://wa.me/6281234567890"
							rel="noreferrer"
							target="_blank"
						>
							<MessageCircle data-icon="inline-start" />
							Chat WhatsApp
						</a>
					</div>
				</div>
			</section>
		</div>
	);
}
