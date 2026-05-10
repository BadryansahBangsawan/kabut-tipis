import { Badge } from "@kabut-tipis/ui/components/badge";
import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { CheckIcon, SparklesIcon } from "lucide-react";

// ─── Data ──────────────────────────────────────────────────────────────────
const FEATURED = {
	id: "rekreasi-harian",
	badge: "Populer",
	name: "Rekreasi Harian",
	price: "Rp25.000",
	duration: "per orang",
	features: [
		"Cocok untuk kunjungan santai harian",
		"Akses area rekreasi sawah & gunung",
		"Voucher minuman pilihan coffeeshop",
		"Reservasi meja via WhatsApp mudah",
	],
};

const SMALL_CARDS = [
	{
		id: "meja-keluarga",
		badge: "Keluarga",
		price: "Rp120.000",
		duration: "per grup",
		features: [
			"Kapasitas 4–6 tamu dalam satu meja",
			"Posisi prioritas dekat view utama",
			"Cocok untuk arisan atau gathering kecil",
		],
		colSpan: "lg:col-span-3",
	},
	{
		id: "camping-santai",
		badge: "Outdoor",
		price: "Rp180.000",
		duration: "per malam",
		features: [
			"Area tenda pribadi di lahan alam",
			"Akses toilet & fasilitas dasar",
			"Nikmati view sawah saat pagi hari",
		],
		colSpan: "lg:col-span-4",
	},
	{
		id: "staycation",
		badge: "Menginap",
		price: "Rp350.000",
		duration: "per malam",
		features: [
			"Kamar privat dengan suasana alam",
			"Sarapan ringan sudah termasuk",
			"Akses penuh area rekreasi Kabut Tipis",
		],
		colSpan: "lg:col-span-4",
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

function SmallCard({
	id,
	badge,
	price,
	duration,
	features,
	colSpan,
}: (typeof SMALL_CARDS)[number]) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-md border border-foreground/10 bg-background",
				"backdrop-blur supports-[backdrop-filter]:bg-background/10",
				colSpan,
			)}
		>
			{/* Header row: badge + CTA */}
			<div className="flex items-center gap-3 p-4">
				<Badge variant="secondary">{badge}</Badge>
				<div className="ml-auto">
					<a
						className={buttonVariants({ variant: "outline", size: "sm" })}
						href={`/reservation?paket=${id}`}
					>
						Reservasi
					</a>
				</div>
			</div>

			{/* Price */}
			<div className="flex items-end gap-2 px-4 py-2">
				<span className="font-mono font-semibold text-5xl tracking-tight">
					{price}
				</span>
				<span className="pb-1 text-muted-foreground text-sm">{duration}</span>
			</div>

			{/* Features */}
			<ul className="grid gap-4 p-4 text-muted-foreground text-sm">
				{features.map((f) => (
					<li key={f} className="flex items-center gap-3">
						<FilledCheck />
						<span>{f}</span>
					</li>
				))}
			</ul>
		</div>
	);
}

// ─── Main export ────────────────────────────────────────────────────────────
export default function Pricing() {
	return (
		<section className="bg-background px-5 py-20 md:py-28">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
				{/* Section header */}
				<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Paket
					</p>
					<h2 className="font-bold text-4xl leading-tight md:text-5xl">
						Pilih paket yang paling cocok untuk kunjunganmu.
					</h2>
					<p className="text-muted-foreground text-sm leading-7 md:text-base">
						Harga awal dapat disesuaikan dengan jumlah tamu dan kebutuhan acara.
					</p>
				</div>

				{/* Bento grid */}
				<div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-8">
					{/* ── Featured card ── */}
					<div
						className={cn(
							"relative w-full overflow-hidden rounded-md border border-foreground/10 bg-background",
							"backdrop-blur supports-[backdrop-filter]:bg-background/10",
							"lg:col-span-5",
						)}
					>
						{/* Decorative mesh overlay */}
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

						{/* Header row: badges + CTA */}
						<div className="relative flex flex-wrap items-center gap-3 p-4">
							<Badge variant="default">{FEATURED.badge}</Badge>
							<Badge className="hidden lg:flex" variant="outline">
								<SparklesIcon className="me-1 size-3" />
								Paling direkomendasikan
							</Badge>
							<div className="ml-auto">
								<a
									className={buttonVariants()}
									href={`/reservation?paket=${FEATURED.id}`}
								>
									Reservasi Sekarang
								</a>
							</div>
						</div>

						{/* Price + features — side by side on lg */}
						<div className="relative flex flex-col p-4 lg:flex-row">
							<div className="pb-4 lg:w-[30%]">
								<span className="font-mono font-semibold text-5xl tracking-tight">
									{FEATURED.price}
								</span>
								<span className="text-muted-foreground text-sm">
									{" "}
									/ {FEATURED.duration}
								</span>
							</div>
							<ul className="grid gap-4 text-muted-foreground text-sm lg:w-[70%]">
								{FEATURED.features.map((f) => (
									<li key={f} className="flex items-center gap-3">
										<FilledCheck />
										<span className="leading-relaxed">{f}</span>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* ── Small cards ── */}
					{SMALL_CARDS.map((card) => (
						<SmallCard key={card.id} {...card} />
					))}
				</div>
			</div>
		</section>
	);
}
