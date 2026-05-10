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
import { Check, Sparkles } from "lucide-react";

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

export default function Pricing() {
	return (
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
						Harga awal dapat disesuaikan dengan jumlah tamu dan kebutuhan acara.
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
							{item.featured ? (
								<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_38%)]" />
							) : null}
							<CardHeader className="relative">
								<div className="flex flex-wrap items-center gap-2">
									<Badge variant={item.featured ? "default" : "secondary"}>
										{item.badge}
									</Badge>
									{item.featured ? (
										<Badge variant="outline">
											<Sparkles />
											Paling direkomendasikan
										</Badge>
									) : null}
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
									{item.features.map((feature) => (
										<li key={feature} className="flex items-center gap-3">
											<span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
												<Check />
											</span>
											<span>{feature}</span>
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
	);
}
