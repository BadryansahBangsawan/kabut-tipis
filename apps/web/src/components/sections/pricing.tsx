import { Badge } from "@kabut-tipis/ui/components/badge";
import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { cn } from "@kabut-tipis/ui/lib/utils";
import {
	CheckIcon,
	FlameIcon,
	SparklesIcon,
	TentIcon,
	TicketIcon,
} from "lucide-react";
import { useState } from "react";

import { RESERVATION_PACKAGE_IDS } from "./pricing.data";

// ─── Data: Paket ───────────────────────────────────────────────────────────
const GLAMPING_EMBUN = {
	id: RESERVATION_PACKAGE_IDS.glampingEmbun,
	name: "Glamping Embun",
	startPrice: "Rp700.000",
	duration: "per malam",
	rates: [
		{
			period: "Senin–Kamis",
			tiers: ["4 orang — Rp700.000", "5 orang — Rp800.000"],
		},
		{
			period: "Jumat–Minggu",
			tiers: ["4 orang — Rp900.000", "5 orang — Rp1.000.000"],
		},
	],
	features: [
		"Check-in 14.00 / Check-out 11.00",
		"Kapasitas maks. 5 orang dewasa",
		"Anak di bawah 2 tahun gratis",
		"Free air mineral 1,5 liter",
		"Tenda, kasur, selimut, bantal lengkap",
	],
};

const TIKET_MASUK = {
	id: RESERVATION_PACKAGE_IDS.tiketMasuk,
	badge: "Tiket Masuk",
	price: "Rp5.000",
	duration: "per orang",
	features: [
		"Akses area rekreasi Kabutipis",
		"Belum termasuk glamping & coffeeshop",
	],
};

const GLAMPING_KAWA = {
	id: RESERVATION_PACKAGE_IDS.glampingKawa,
	badge: "Camping",
	startPrice: "Rp500.000",
	duration: "per malam",
	rates: [
		{
			period: "Senin–Kamis",
			tiers: ["2 orang — Rp500.000", "3 orang — Rp600.000"],
		},
		{
			period: "Jumat–Minggu",
			tiers: ["2 orang — Rp700.000", "3 orang — Rp800.000"],
		},
	],
	features: [
		"Check-in 14.00 / Check-out 11.00",
		"Kapasitas maks. 3 orang dewasa",
		"Anak di bawah 2 tahun gratis",
		"Free air mineral 1,5 liter",
	],
};

const GRILL_CHILL = {
	id: RESERVATION_PACKAGE_IDS.grillChill,
	badge: "BBQ",
	startPrice: "Rp350.000",
	duration: "per paket",
	tiers: [
		{ name: "2–3 pax", price: "Rp350.000" },
		{ name: "4–5 pax", price: "Rp500.000" },
		{ name: "6–8 pax", price: "Rp800.000" },
	],
	features: [
		"Tenda, kursi, meja disediakan",
		"Daging sapi, sosis, sayuran, nasi",
		"Peralatan masak lengkap",
		"Durasi 3 jam",
	],
};

// ─── Data: Menu ────────────────────────────────────────────────────────────
const MENU_TABS = [
	{
		id: "coffee",
		label: "Coffee",
		items: [
			{ name: "Aren", price: "Rp28.000" },
			{ name: "Coffee Milk", price: "Rp28.000" },
			{ name: "Latte", price: "Rp25.000" },
			{ name: "Americano", price: "Rp15.000" },
			{ name: "Pandan Coffee", price: "Rp28.000" },
			{ name: "Avocado Coffee", price: "Rp28.000" },
		],
	},
	{
		id: "non-coffee",
		label: "Non-Coffee",
		items: [
			{ name: "Kabutipis Signature", price: "Rp28.000" },
			{ name: "Regal Brown Sugar", price: "Rp28.000" },
			{ name: "Brown Sugar Jelly", price: "Rp28.000" },
			{ name: "Chocolate", price: "Rp28.000" },
			{ name: "Milk Brown Sugar", price: "Rp25.000" },
			{ name: "Klepon Pandan", price: "Rp28.000" },
			{ name: "Matcha", price: "Rp28.000" },
			{ name: "Air Mineral", price: "Rp5.000" },
		],
	},
	{
		id: "fresh-drink",
		label: "Fresh Drink",
		items: [
			{ name: "Lemon Tea", price: "Rp25.000" },
			{ name: "Sunkist Orange", price: "Rp25.000" },
			{ name: "Markisa", price: "Rp25.000" },
			{ name: "Watermelon", price: "Rp25.000" },
		],
	},
	{
		id: "food",
		label: "Food",
		items: [
			{ name: "Indomie Soto", price: "Rp15.000" },
			{ name: "Indomie Soto + Telur", price: "Rp20.000" },
			{ name: "Indomie Goreng", price: "Rp15.000" },
			{ name: "Indomie Goreng + Telur", price: "Rp20.000" },
			{ name: "Topping Bakso", price: "Rp10.000" },
			{ name: "Nasi Ayam Goreng", price: "Rp35.000" },
			{ name: "Nasi Tuna Asap", price: "Rp35.000" },
			{ name: "Nasi Daging Lada Hitam", price: "Rp35.000" },
		],
	},
	{
		id: "snack",
		label: "Snack",
		items: [
			{ name: "Kentang Goreng", price: "Rp20.000" },
			{ name: "Pisang Goreng Original", price: "Rp22.000" },
			{ name: "Pisang Goreng Palm Sugar", price: "Rp28.000" },
			{ name: "Pisang Goreng Coklat", price: "Rp25.000" },
			{ name: "Pisang Goreng Coklat Keju", price: "Rp28.000" },
			{ name: "Pisang Goreng Sambel", price: "Rp25.000" },
		],
	},
];

// ─── Sub-components ─────────────────────────────────────────────────────────
function FilledCheck() {
	return (
		<span className="flex shrink-0 items-center justify-center rounded-full bg-primary p-0.5 text-primary-foreground">
			<CheckIcon className="size-3" strokeWidth={3} />
		</span>
	);
}

function RateGroup({ period, tiers }: { period: string; tiers: string[] }) {
	return (
		<div className="flex flex-col gap-1.5">
			<p className="font-medium text-foreground text-xs">{period}</p>
			{tiers.map((t) => (
				<p key={t} className="text-muted-foreground text-sm">
					{t}
				</p>
			))}
		</div>
	);
}

function CardDivider({ loose }: { loose?: boolean }) {
	return (
		<div
			className={cn("mx-5 border-border/60 border-t", loose ? "my-5" : "my-4")}
		/>
	);
}

// ─── Main export ────────────────────────────────────────────────────────────
export default function Pricing() {
	const [activeMenu, setActiveMenu] = useState("coffee");
	const currentMenu =
		MENU_TABS.find((t) => t.id === activeMenu) ?? MENU_TABS[0];

	return (
		<section className="bg-background px-5 py-20 md:py-28">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
				{/* ── Paket Section ── */}
				<div className="flex flex-col gap-10">
					<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Paket & Harga
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Pilih paket yang paling cocok untuk kunjunganmu.
						</h2>
						<p className="text-muted-foreground text-sm leading-7 md:text-base">
							Harga dapat berbeda di hari biasa dan akhir pekan. Reservasi via
							WhatsApp.
						</p>
					</div>

					{/* Bento grid */}
					<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-8">
						{/* ── Glamping Embun (featured) ── */}
						<div
							className={cn(
								"relative flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-background",
								"md:col-span-2 lg:col-span-5",
							)}
						>
							{/* Decorative mesh */}
							<div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
								<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/2 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
									<div
										aria-hidden="true"
										className={cn(
											"absolute inset-0 size-full mix-blend-overlay",
											"bg-[linear-gradient(to_right,color-mix(in_oklch,var(--primary)_8%,transparent)_1px,transparent_1px)]",
											"bg-[size:24px]",
										)}
									/>
								</div>
							</div>

							{/* Badges */}
							<div className="relative flex flex-wrap items-center gap-2 p-5 pb-0">
								<Badge variant="default">
									<TentIcon className="me-1 size-3" />
									Glamping
								</Badge>
								<Badge className="hidden sm:flex" variant="outline">
									<SparklesIcon className="me-1 size-3" />
									Paling direkomendasikan
								</Badge>
							</div>

							{/* Price */}
							<div className="relative px-5 pt-4">
								<p className="text-muted-foreground text-xs">mulai dari</p>
								<p className="font-bold font-mono text-5xl tracking-tight">
									{GLAMPING_EMBUN.startPrice}
								</p>
								<p className="mt-1 text-muted-foreground text-sm">
									{GLAMPING_EMBUN.duration}
								</p>
							</div>

							{/* Divider */}
							<CardDivider loose />

							{/* Rates */}
							<div className="relative grid grid-cols-2 gap-4 px-5">
								{GLAMPING_EMBUN.rates.map((r) => (
									<RateGroup key={r.period} period={r.period} tiers={r.tiers} />
								))}
							</div>

							{/* Divider */}
							<CardDivider loose />

							{/* Features */}
							<ul className="relative flex flex-1 flex-col gap-3 px-5 text-muted-foreground text-sm">
								{GLAMPING_EMBUN.features.map((f) => (
									<li key={f} className="flex items-center gap-3">
										<FilledCheck />
										<span className="leading-relaxed">{f}</span>
									</li>
								))}
							</ul>

							{/* CTA */}
							<div className="relative p-5 pt-6">
								<a
									className={buttonVariants()}
									href={`/reservation?paket=${GLAMPING_EMBUN.id}`}
								>
									Reservasi Sekarang
								</a>
							</div>
						</div>

						{/* ── Tiket Masuk ── */}
						<div className="relative flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-background lg:col-span-3">
							<div className="p-5 pb-0">
								<Badge variant="secondary">
									<TicketIcon className="me-1 size-3" />
									{TIKET_MASUK.badge}
								</Badge>
							</div>

							<div className="px-5 pt-3">
								<p className="font-mono font-semibold text-4xl tracking-tight">
									{TIKET_MASUK.price}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{TIKET_MASUK.duration}
								</p>
							</div>

							<CardDivider />

							<ul className="flex flex-1 flex-col gap-3 px-5 text-muted-foreground text-sm">
								{TIKET_MASUK.features.map((f) => (
									<li key={f} className="flex items-start gap-2.5">
										<FilledCheck />
										<span className="leading-relaxed">{f}</span>
									</li>
								))}
							</ul>

							<div className="p-5 pt-5">
								<a
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
										"w-full",
									)}
									href={`/reservation?paket=${TIKET_MASUK.id}`}
								>
									Reservasi
								</a>
							</div>
						</div>

						{/* ── Glamping Kawa ── */}
						<div className="relative flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-background lg:col-span-4">
							<div className="p-5 pb-0">
								<Badge variant="secondary">
									<TentIcon className="me-1 size-3" />
									{GLAMPING_KAWA.badge}
								</Badge>
							</div>

							<div className="px-5 pt-3">
								<p className="text-muted-foreground text-xs">mulai dari</p>
								<p className="font-mono font-semibold text-4xl tracking-tight">
									{GLAMPING_KAWA.startPrice}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{GLAMPING_KAWA.duration}
								</p>
							</div>

							<CardDivider />

							<div className="grid grid-cols-2 gap-4 px-5">
								{GLAMPING_KAWA.rates.map((r) => (
									<RateGroup key={r.period} period={r.period} tiers={r.tiers} />
								))}
							</div>

							<CardDivider />

							<ul className="flex flex-1 flex-col gap-3 px-5 text-muted-foreground text-sm">
								{GLAMPING_KAWA.features.map((f) => (
									<li key={f} className="flex items-start gap-2.5">
										<FilledCheck />
										<span className="leading-relaxed">{f}</span>
									</li>
								))}
							</ul>

							<div className="p-5 pt-5">
								<a
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
										"w-full",
									)}
									href={`/reservation?paket=${GLAMPING_KAWA.id}`}
								>
									Reservasi
								</a>
							</div>
						</div>

						{/* ── Grill & Chill ── */}
						<div className="relative flex flex-col overflow-hidden rounded-md border border-foreground/10 bg-background lg:col-span-4">
							<div className="p-5 pb-0">
								<Badge variant="secondary">
									<FlameIcon className="me-1 size-3" />
									{GRILL_CHILL.badge}
								</Badge>
							</div>

							<div className="px-5 pt-3">
								<p className="text-muted-foreground text-xs">mulai dari</p>
								<p className="font-mono font-semibold text-4xl tracking-tight">
									{GRILL_CHILL.startPrice}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{GRILL_CHILL.duration}
								</p>
							</div>

							<CardDivider />

							{/* Tier table */}
							<div className="flex flex-col gap-2 px-5">
								{GRILL_CHILL.tiers.map((t) => (
									<div
										key={t.name}
										className="flex items-center justify-between text-sm"
									>
										<span className="text-muted-foreground">{t.name}</span>
										<span className="font-medium text-foreground">
											{t.price}
										</span>
									</div>
								))}
							</div>

							<CardDivider />

							<ul className="flex flex-1 flex-col gap-3 px-5 text-muted-foreground text-sm">
								{GRILL_CHILL.features.map((f) => (
									<li key={f} className="flex items-start gap-2.5">
										<FilledCheck />
										<span className="leading-relaxed">{f}</span>
									</li>
								))}
							</ul>

							<div className="p-5 pt-5">
								<a
									className={cn(
										buttonVariants({ variant: "outline", size: "sm" }),
										"w-full",
									)}
									href={`/reservation?paket=${GRILL_CHILL.id}`}
								>
									Reservasi
								</a>
							</div>
						</div>
					</div>
				</div>

				{/* ── Menu Section ── */}
				<div className="flex flex-col gap-8">
					<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Menu
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Coffeeshop & makanan.
						</h2>
					</div>

					{/* Tabs */}
					<div className="flex flex-wrap justify-center gap-2">
						{MENU_TABS.map((tab) => (
							<button
								key={tab.id}
								className={cn(
									"rounded-full border px-4 py-1.5 font-medium text-sm transition-colors",
									activeMenu === tab.id
										? "border-primary bg-primary text-primary-foreground"
										: "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground",
								)}
								onClick={() => setActiveMenu(tab.id)}
								type="button"
							>
								{tab.label}
							</button>
						))}
					</div>

					{/* Menu grid */}
					<div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-md border border-border/60 sm:grid-cols-2">
						{currentMenu.items.map((item) => (
							<div
								key={item.name}
								className="flex items-center justify-between border-border/40 border-b bg-background px-5 py-3.5 last:border-b-0 sm:[&:nth-last-child(2):nth-child(odd)]:border-b-0"
							>
								<span className="text-foreground text-sm">{item.name}</span>
								<span className="font-mono text-muted-foreground text-sm">
									{item.price}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
