import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { Card } from "@kabut-tipis/ui/components/card";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import {
	ChevronDown,
	Coffee,
	Home,
	MapPin,
	MessageCircle,
	Minus,
	Mountain,
	ParkingCircle,
	Phone,
	Tent,
	Wifi,
} from "lucide-react";
import { useState } from "react";

import Pricing from "../components/sections/pricing";

export const Route = createFileRoute("/services")({
	component: ServicesPage,
});

// ─── Data ───────────────────────────────────────────────────────────────────
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
		a: "Isi form reservasi di halaman Reservasi, lalu klik 'Konfirmasi via WhatsApp'. Pesan akan otomatis terisi dan tinggal dikirim ke kami.",
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

// ─── FAQ Item ────────────────────────────────────────────────────────────────
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

// ─── Page ────────────────────────────────────────────────────────────────────
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

			{/* Packages — reuse shared Pricing component */}
			<Pricing />

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

					<div>
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
