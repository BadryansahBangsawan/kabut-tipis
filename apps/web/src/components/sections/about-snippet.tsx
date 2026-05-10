import { buttonVariants } from "@kabut-tipis/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@kabut-tipis/ui/components/card";
import { ArrowRight, Mountain, Waves } from "lucide-react";

const ABOUT_IMAGE =
	"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=85&w=1200&auto=format&fit=crop";

export default function AboutSnippet() {
	return (
		<section className="bg-background px-5 py-20 md:py-28">
			<div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
				<div className="relative min-h-[420px] overflow-hidden rounded-md">
					<img
						alt="Suasana hijau dan asri di area Kabut Tipis"
						className="absolute inset-0 size-full object-cover"
						src={ABOUT_IMAGE}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-foreground/35 to-transparent" />
					<div className="absolute right-4 bottom-4 left-4 grid grid-cols-2 gap-3">
						<Card className="bg-background/85 backdrop-blur" size="sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Mountain />
									Gunung
								</CardTitle>
								<CardDescription>
									Pemandangan terbuka dari area utama.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card className="bg-background/85 backdrop-blur" size="sm">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Waves />
									Sungai
								</CardTitle>
								<CardDescription>
									Aliran air alami dekat ruang santai.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-4">
						<p className="font-semibold text-primary text-sm uppercase tracking-normal">
							Tentang Kabut Tipis
						</p>
						<h2 className="max-w-xl font-bold text-4xl leading-tight md:text-5xl">
							Ruang singgah untuk menikmati alam tanpa jauh dari kenyamanan.
						</h2>
						<p className="max-w-xl text-muted-foreground text-sm leading-7 md:text-base">
							Kabut Tipis menggabungkan coffeeshop, area rekreasi, dan
							penginapan dalam satu lanskap hijau. Cocok untuk keluarga,
							komunitas, atau tamu yang ingin rehat dengan udara segar.
						</p>
					</div>
					<Card className="max-w-xl">
						<CardContent className="grid gap-4 sm:grid-cols-3">
							<div>
								<p className="font-bold text-3xl">3</p>
								<p className="text-muted-foreground text-xs">area utama</p>
							</div>
							<div>
								<p className="font-bold text-3xl">360</p>
								<p className="text-muted-foreground text-xs">derajat lanskap</p>
							</div>
							<div>
								<p className="font-bold text-3xl">1</p>
								<p className="text-muted-foreground text-xs">
									reservasi via WA
								</p>
							</div>
						</CardContent>
					</Card>
					<div>
						<a className={buttonVariants({ size: "lg" })} href="/about">
							Selengkapnya
							<ArrowRight data-icon="inline-end" />
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
