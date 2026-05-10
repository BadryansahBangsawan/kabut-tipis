import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, CalendarCheck } from "lucide-react";
import { useRef } from "react";

const HERO_IMAGE =
	"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1800&auto=format&fit=crop";
const MEDIA_IMAGE =
	"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1400&auto=format&fit=crop";

export default function Hero() {
	const sectionRef = useRef<HTMLElement>(null);
	const { scrollYProgress } = useScroll({
		target: sectionRef,
		offset: ["start start", "end start"],
	});
	const smoothProgress = useSpring(scrollYProgress, {
		stiffness: 90,
		damping: 24,
		mass: 0.7,
	});
	const mediaScale = useTransform(smoothProgress, [0, 1], [1, 4.25]);
	const mediaRadius = useTransform(smoothProgress, [0, 1], [24, 0]);
	const bgOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.18]);
	const leftTitle = useTransform(smoothProgress, [0, 1], ["0vw", "-22vw"]);
	const rightTitle = useTransform(smoothProgress, [0, 1], ["0vw", "22vw"]);
	const hintOpacity = useTransform(smoothProgress, [0, 0.35], [1, 0]);

	return (
		<section ref={sectionRef} className="relative h-[138dvh] bg-background">
			<div className="sticky top-0 h-[92dvh] overflow-hidden">
				<motion.img
					alt="Pemandangan alam pegunungan dan sawah"
					className="absolute inset-0 size-full object-cover"
					src={HERO_IMAGE}
					style={{ opacity: bgOpacity }}
				/>
				<div className="absolute inset-0 bg-foreground/25" />
				<div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-foreground/35 to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

				<div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pt-16 text-center">
					<motion.div
						className="absolute h-[min(420px,58vh)] w-[min(340px,72vw)] overflow-hidden shadow-2xl shadow-foreground/25 ring-1 ring-background/40"
						style={{
							borderRadius: mediaRadius,
							scale: mediaScale,
						}}
					>
						<img
							alt="Aliran sungai dan lanskap hijau Kabut Tipis"
							className="size-full object-cover"
							src={MEDIA_IMAGE}
						/>
						<div className="absolute inset-0 bg-foreground/15" />
					</motion.div>

					<div className="relative z-10 flex flex-col items-center gap-2 text-primary-foreground">
						<motion.p
							className="font-semibold text-sm uppercase tracking-normal md:text-base"
							style={{ opacity: hintOpacity }}
						>
							Coffeeshop, rekreasi, dan penginapan alam
						</motion.p>
						<div className="flex flex-col items-center gap-0 text-[clamp(3.8rem,13vw,11rem)] leading-none md:flex-row md:gap-8">
							<motion.h1
								className="font-extrabold drop-shadow-2xl"
								style={{ x: leftTitle }}
							>
								Kabut
							</motion.h1>
							<motion.h1
								className="font-extrabold drop-shadow-2xl"
								style={{ x: rightTitle }}
							>
								Tipis
							</motion.h1>
						</div>
						<motion.div
							className="mt-4 flex flex-col items-center gap-3 sm:flex-row"
							style={{ opacity: hintOpacity }}
						>
							<a className={buttonVariants({ size: "lg" })} href="/reservation">
								<CalendarCheck data-icon="inline-start" />
								Reservasi Sekarang
							</a>
							<div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
								<ArrowDown />
								Scroll untuk Menjelajahi
							</div>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
