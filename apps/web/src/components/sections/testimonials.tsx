import { cn } from "@kabut-tipis/ui/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const testimonials = [
	{
		id: 1,
		quote:
			"Tempatnya tenang, udara segar, dan cocok untuk kumpul keluarga sambil ngopi.",
		by: "Ayu, tamu keluarga",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=220&auto=format&fit=crop",
	},
	{
		id: 2,
		quote:
			"Pemandangan sawah dan aliran sungainya bikin betah. Reservasi lewat WhatsApp juga cepat.",
		by: "Rizal, komunitas motor",
		image:
			"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=220&auto=format&fit=crop",
	},
	{
		id: 3,
		quote:
			"Datang sore, pulang malam. Suasananya tetap nyaman dan stafnya ramah.",
		by: "Dina, pengunjung coffeeshop",
		image:
			"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=220&auto=format&fit=crop",
	},
	{
		id: 4,
		quote:
			"Area terbukanya luas untuk anak-anak. View gunungnya jadi bonus terbaik.",
		by: "Bima, tamu rekreasi",
		image:
			"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=220&auto=format&fit=crop",
	},
	{
		id: 5,
		quote:
			"Paket menginapnya pas untuk rehat singkat. Pagi hari terasa paling menyenangkan.",
		by: "Nadia, tamu penginapan",
		image:
			"https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=220&auto=format&fit=crop",
	},
];

function getPosition(index: number, activeIndex: number, length: number) {
	let position = index - activeIndex;

	if (position > length / 2) {
		position -= length;
	}

	if (position < -length / 2) {
		position += length;
	}

	return position;
}

export default function Testimonials() {
	const [activeIndex, setActiveIndex] = useState(0);
	const [cardSize, setCardSize] = useState(340);

	useEffect(() => {
		const updateSize = () => setCardSize(window.innerWidth < 640 ? 286 : 340);

		updateSize();
		window.addEventListener("resize", updateSize);

		return () => window.removeEventListener("resize", updateSize);
	}, []);

	const move = (step: number) => {
		setActiveIndex(
			(current) => (current + step + testimonials.length) % testimonials.length,
		);
	};

	return (
		<section className="bg-muted px-5 py-20 md:py-28">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
				<div className="mx-auto flex max-w-3xl flex-col gap-4 text-center">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Testimonial
					</p>
					<h2 className="font-bold text-4xl leading-tight md:text-5xl">
						Cerita singkat dari tamu Kabut Tipis.
					</h2>
				</div>

				<div className="relative h-[560px] overflow-hidden">
					{testimonials.map((testimonial, index) => {
						const position = getPosition(
							index,
							activeIndex,
							testimonials.length,
						);
						const isCenter = position === 0;

						return (
							<button
								key={testimonial.id}
								className={cn(
									"absolute top-1/2 left-1/2 flex cursor-pointer flex-col gap-5 border p-7 text-left transition-all duration-500",
									isCenter
										? "z-20 border-primary bg-primary text-primary-foreground"
										: "z-10 border-border bg-background text-foreground opacity-75 hover:opacity-100",
								)}
								onClick={() => setActiveIndex(index)}
								style={{
									width: cardSize,
									height: cardSize,
									clipPath:
										"polygon(34px 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%, 0 34px)",
									transform: `
										translate(-50%, -50%)
										translateX(${position * (cardSize * 0.62)}px)
										translateY(${isCenter ? -26 : position % 2 === 0 ? -4 : 18}px)
										rotate(${isCenter ? 0 : position % 2 === 0 ? -2.5 : 2.5}deg)
									`,
								}}
								type="button"
							>
								<img
									alt={testimonial.by}
									className="size-14 object-cover"
									src={testimonial.image}
								/>
								<p className="font-medium text-lg leading-7">
									"{testimonial.quote}"
								</p>
								<p
									className={cn(
										"mt-auto text-sm",
										isCenter
											? "text-primary-foreground/80"
											: "text-muted-foreground",
									)}
								>
									- {testimonial.by}
								</p>
							</button>
						);
					})}

					<div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
						<button
							aria-label="Testimonial sebelumnya"
							className="flex size-12 items-center justify-center border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
							onClick={() => move(-1)}
							type="button"
						>
							<ChevronLeft />
						</button>
						<button
							aria-label="Testimonial berikutnya"
							className="flex size-12 items-center justify-center border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
							onClick={() => move(1)}
							type="button"
						>
							<ChevronRight />
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
