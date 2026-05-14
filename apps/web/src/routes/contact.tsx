import { buttonVariants } from "@kabut-tipis/ui/components/button";
import {
	Map as LocationMap,
	MapMarker,
	MarkerContent,
	MarkerTooltip,
} from "@kabut-tipis/ui/components/ui/map";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Copy, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Kontak & Lokasi — Kabut Tipis" },
			{
				name: "description",
				content:
					"Hubungi Kabut Tipis via WhatsApp atau temukan lokasi kami di Google Maps. Kami buka setiap hari 08.00–22.00 WIB.",
			},
		],
	}),
	component: ContactPage,
});

// ─── Data ─────────────────────────────────────────────────────────────────────
const WA_NUMBER = "6285245055567";
const PHONE_NUMBER = "+6285245055567";
const ADDRESS =
	"QV98+49R, Jl. Gallang Rapa, Gantarang, Kec. Tinggimoncong, Kabupaten Gowa, Sulawesi Selatan 92174";
const INSTAGRAM = "https://www.instagram.com/kabutipiscampsite";
const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/pqquk98eyFmz2j4j8";
const LNG = 119.8658794;
const LAT = -5.2321271;

const INFO_CARDS = [
	{
		icon: MapPin,
		title: "Alamat",
		href: GOOGLE_MAPS_URL,
	},
	{
		icon: MessageCircle,
		title: "WhatsApp",
		href: `https://wa.me/${WA_NUMBER}`,
	},
	{
		icon: Clock,
		title: "Jam Operasional",
		href: null,
	},
];

// ─── Instagram icon ───────────────────────────────────────────────────────────
function InstagramIcon({ className }: { className?: string }) {
	return (
		<svg
			className={className}
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth={2}
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<rect height="20" rx="5" ry="5" width="20" x="2" y="2" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
			<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
		</svg>
	);
}

// ─── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			className="flex items-center gap-1.5 text-muted-foreground text-xs transition-colors hover:text-foreground"
			onClick={handleCopy}
			type="button"
		>
			<Copy className="size-3" />
			{copied ? "Tersalin!" : "Salin alamat"}
		</button>
	);
}

// ─── Page ─────────────────────────────────────────────────────────────────────
function ContactPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* Header */}
			<section className="bg-muted px-5 pt-28 pb-16 text-center">
				<div className="mx-auto flex max-w-xl flex-col gap-4">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Kontak
					</p>
					<h1 className="font-bold text-4xl leading-tight md:text-5xl">
						Kami siap membantu.
					</h1>
					<p className="text-muted-foreground text-sm leading-7 md:text-base">
						Hubungi kami via WhatsApp untuk reservasi atau pertanyaan. Tim kami
						biasanya merespons dalam hitungan menit.
					</p>
				</div>
			</section>

			{/* Info Cards */}
			<section className="bg-background px-5 py-16">
				<div className="mx-auto grid w-full max-w-5xl gap-4 sm:grid-cols-3">
					{INFO_CARDS.map(({ icon: Icon, title, href }) => {
						const inner = (
							<>
								<span className="flex size-10 items-center justify-center rounded-full bg-accent transition-colors group-hover:bg-primary/10">
									<Icon className="size-4 text-primary" />
								</span>
								<p className="font-semibold text-sm">{title}</p>
							</>
						);

						if (href) {
							return (
								<a
									key={title}
									className="group flex flex-col gap-3 rounded-sm border border-border p-5 transition-colors hover:border-primary/40 hover:bg-muted"
									href={href}
									rel="noreferrer"
									target="_blank"
								>
									{inner}
								</a>
							);
						}

						return (
							<div
								key={title}
								className="group flex flex-col gap-3 rounded-sm border border-border p-5"
							>
								{inner}
							</div>
						);
					})}
				</div>
			</section>

			{/* Map */}
			<section className="bg-muted px-5 py-16">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
					<div className="flex flex-col gap-2">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Lokasi
						</p>
						<h2 className="font-bold text-2xl">Temukan kami di sini.</h2>
					</div>
					<div className="group relative h-[360px] overflow-hidden rounded-sm border border-border md:h-[460px]">
						<LocationMap center={[LNG, LAT]} zoom={15} className="size-full">
							<MapMarker longitude={LNG} latitude={LAT}>
								<MarkerContent>
									<span className="flex size-8 items-center justify-center rounded-full bg-primary shadow-md">
										<MapPin className="size-4 text-primary-foreground" />
									</span>
								</MarkerContent>
								<MarkerTooltip>Kabut Tipis</MarkerTooltip>
							</MapMarker>
						</LocationMap>
						{/* Click overlay → buka Google Maps */}
						<a
							className="absolute inset-0 z-10 flex items-end justify-end p-4"
							href={GOOGLE_MAPS_URL}
							rel="noreferrer"
							target="_blank"
						>
							<span className="flex items-center gap-2 rounded-sm bg-background/90 px-3 py-2 font-medium text-xs opacity-80 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100">
								<MapPin className="size-3 text-primary" />
								Buka di Google Maps
							</span>
						</a>
					</div>
					<p className="text-muted-foreground text-sm">{ADDRESS}</p>
				</div>
			</section>

			{/* Quick Actions */}
			<section className="bg-background px-5 py-16">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
					<div className="flex flex-col gap-2 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Hubungi Kami
						</p>
						<h2 className="font-bold text-2xl">Mulai percakapan sekarang.</h2>
					</div>

					<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
						<a
							className={buttonVariants({ size: "lg" })}
							href={`https://wa.me/${WA_NUMBER}`}
							rel="noreferrer"
							target="_blank"
						>
							<MessageCircle data-icon="inline-start" />
							Chat WhatsApp
						</a>
						<a
							className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
							href={`tel:${PHONE_NUMBER}`}
						>
							<Phone data-icon="inline-start" />
							Telepon
						</a>
						<a
							className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
							href={INSTAGRAM}
							rel="noreferrer"
							target="_blank"
						>
							<InstagramIcon className="size-4" data-icon="inline-start" />
							Instagram
						</a>
						<CopyButton text={ADDRESS} />
					</div>
				</div>
			</section>
		</div>
	);
}
