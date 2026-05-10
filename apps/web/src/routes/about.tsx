import { createFileRoute } from "@tanstack/react-router";
import {
	Cloud,
	Droplets,
	MapPin,
	Mountain,
	ParkingCircle,
	Phone,
	Star,
	Trees,
	Wifi,
} from "lucide-react";

export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "Tentang Kami — Kabut Tipis" },
			{
				name: "description",
				content:
					"Cerita di balik Kabut Tipis — tempat rekreasi, coffeeshop, dan penginapan yang menyatu dengan alam pegunungan, sawah, dan sungai.",
			},
		],
	}),
	component: AboutPage,
});

// ─── Data ────────────────────────────────────────────────────────────────────
const STORY_IMAGE =
	"https://images.unsplash.com/photo-1501854140801-50d01698950b?q=85&w=1800&auto=format&fit=crop";

const keunggulan = [
	{
		icon: Mountain,
		title: "Pemandangan Gunung",
		desc: "Silhuet gunung terlihat jelas dari area utama, terutama di pagi dan sore hari.",
	},
	{
		icon: Trees,
		title: "Sawah Hijau",
		desc: "Hamparan sawah mengelilingi area, memberikan nuansa alami yang menenangkan.",
	},
	{
		icon: Droplets,
		title: "Aliran Sungai",
		desc: "Suara gemericik air sungai menemani setiap kunjungan dari area santai.",
	},
	{
		icon: Cloud,
		title: "Udara Segar",
		desc: "Ketinggian lokasi menjamin udara sejuk dan bersih sepanjang hari.",
	},
];

const stats = [
	{ value: "2019", label: "Tahun Berdiri" },
	{ value: "5.000+", label: "Total Tamu" },
	{ value: "4.8", label: "Rating Google" },
	{ value: "2 Ha", label: "Luas Area" },
];

const fasilitas = [
	{ icon: Wifi, label: "WiFi Gratis" },
	{ icon: ParkingCircle, label: "Parkir Luas" },
	{ icon: Star, label: "Mushola" },
	{ icon: Droplets, label: "Toilet Bersih" },
	{ icon: Phone, label: "Reservasi WA" },
	{ icon: Mountain, label: "Area Foto" },
	{ icon: Trees, label: "Area Piknik" },
	{ icon: MapPin, label: "Jalur Wisata" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
function AboutPage() {
	return (
		<div className="min-h-screen bg-background">
			{/* ── Story ── */}
			<section className="relative min-h-[55vh] overflow-hidden">
				<img
					alt="Pemandangan panorama alam Kabut Tipis"
					className="absolute inset-0 size-full object-cover"
					src={STORY_IMAGE}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/30 to-background" />
				<div className="relative flex min-h-[55vh] flex-col items-center justify-end px-5 pt-32 pb-16 text-center">
					<p className="mb-3 font-semibold text-primary-foreground/80 text-sm uppercase tracking-normal">
						Tentang Kami
					</p>
					<h1 className="max-w-2xl font-bold text-4xl text-primary-foreground leading-tight md:text-6xl">
						Lebih dari sekadar tempat singgah.
					</h1>
				</div>
			</section>

			{/* ── Narasi ── */}
			<section className="bg-background px-5 py-20 md:py-28">
				<div className="mx-auto grid w-full max-w-5xl gap-10 md:grid-cols-2">
					<div className="flex flex-col gap-5">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Cerita Kami
						</p>
						<h2 className="font-bold text-3xl leading-tight md:text-4xl">
							Berawal dari cinta terhadap alam dan ketenangan.
						</h2>
					</div>
					<div className="flex flex-col gap-4 text-muted-foreground text-sm leading-7 md:text-base">
						<p>
							Kabut Tipis lahir dari keinginan sederhana: menyediakan ruang di
							mana orang bisa beristirahat tanpa harus meninggalkan kenyamanan.
							Kami membangun coffeeshop, area rekreasi, dan penginapan yang
							menyatu dengan lanskap alam — gunung, sawah, dan sungai — sebagai
							bagian dari pengalaman, bukan sekadar latar belakang.
						</p>
						<p>
							Sejak dibuka, Kabut Tipis telah menyambut ribuan tamu dari
							berbagai penjuru. Kami percaya bahwa alam punya cara tersendiri
							untuk memulihkan energi, dan tugas kami adalah membuat akses ke
							alam itu semudah dan senyaman mungkin.
						</p>
					</div>
				</div>
			</section>

			{/* ── Keunggulan ── */}
			<section className="bg-muted px-5 py-20 md:py-28">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
					<div className="flex flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Keunggulan
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Empat alasan tamu selalu kembali.
						</h2>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{keunggulan.map(({ icon: Icon, title, desc }) => (
							<div
								key={title}
								className="flex flex-col gap-4 rounded-sm border border-border bg-background p-6"
							>
								<span className="flex size-11 items-center justify-center rounded-full bg-accent">
									<Icon className="size-5 text-primary" />
								</span>
								<div className="flex flex-col gap-1">
									<p className="font-semibold text-sm">{title}</p>
									<p className="text-muted-foreground text-xs leading-6">
										{desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Stats ── */}
			<section className="bg-primary px-5 py-20 md:py-28">
				<div className="mx-auto grid w-full max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
					{stats.map(({ value, label }) => (
						<div
							key={label}
							className="flex flex-col items-center gap-2 text-center"
						>
							<p className="font-bold text-5xl text-primary-foreground md:text-6xl">
								{value}
							</p>
							<p className="text-primary-foreground/75 text-sm">{label}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── Fasilitas ── */}
			<section className="bg-background px-5 py-20 md:py-28">
				<div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
					<div className="flex flex-col gap-4 text-center">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Fasilitas
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-5xl">
							Semua tersedia untuk kenyamananmu.
						</h2>
					</div>

					<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
						{fasilitas.map(({ icon: Icon, label }) => (
							<div
								key={label}
								className="flex items-center gap-3 rounded-sm border border-border px-4 py-3"
							>
								<Icon className="size-4 shrink-0 text-primary" />
								<span className="text-sm">{label}</span>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
