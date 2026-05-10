import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@kabut-tipis/ui/components/card";
import { Coffee, Home, TreePine } from "lucide-react";

const services = [
	{
		title: "Coffeeshop",
		description:
			"Menu hangat dan ringan untuk menemani pemandangan gunung dan sawah.",
		icon: Coffee,
	},
	{
		title: "Penginapan",
		description:
			"Pilihan bermalam untuk tamu yang ingin menikmati suasana lebih lama.",
		icon: Home,
	},
	{
		title: "Area Rekreasi",
		description:
			"Ruang terbuka untuk keluarga, komunitas, foto, dan kegiatan santai.",
		icon: TreePine,
	},
];

export default function ServicesPreview() {
	return (
		<section className="bg-muted px-5 py-20 md:py-28">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
				<div className="flex max-w-3xl flex-col gap-4">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Layanan
					</p>
					<h2 className="font-bold text-4xl leading-tight md:text-5xl">
						Satu lokasi untuk ngopi, menginap, dan menikmati alam.
					</h2>
				</div>
				<div className="grid gap-4 md:grid-cols-3">
					{services.map((service) => {
						const Icon = service.icon;

						return (
							<Card key={service.title} className="bg-background">
								<CardHeader>
									<div className="mb-6 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
										<Icon />
									</div>
									<CardTitle className="text-2xl">{service.title}</CardTitle>
									<CardDescription>{service.description}</CardDescription>
								</CardHeader>
								<CardContent>
									<a
										className="font-semibold text-primary text-sm"
										href="/services"
									>
										Lihat detail layanan
									</a>
								</CardContent>
							</Card>
						);
					})}
				</div>
			</div>
		</section>
	);
}
