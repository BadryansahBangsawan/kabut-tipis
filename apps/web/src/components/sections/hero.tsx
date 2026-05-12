import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { ArrowDown, CalendarCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const HERO_IMAGE = "/kabut-tipis-asset/foto/1.png";

const VIDEO_SRC =
	"/kabut-tipis-asset/vidio/TENDA%20KAWAKAPASITAS%203%20ORANG%20MAKSIMALSENIN%20-%20KAMIS%20HARGA%20500K%20-%20600K%20PER%20MALAMJUMAT%20-%20MINGGUHARGA.mp4";

export default function Hero() {
	const progressRef = useRef(0);
	const expandedRef = useRef(false);
	const touchStartYRef = useRef(0);

	const [progress, setProgress] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		let prev = window.innerWidth < 768;
		setIsMobile(prev);
		const check = () => {
			const next = window.innerWidth < 768;
			if (next !== prev) { prev = next; setIsMobile(next); }
		};
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const applyProgress = useCallback((next: number) => {
		progressRef.current = next;
		expandedRef.current = next >= 1;
		setProgress(next);
	}, []);

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			if (expandedRef.current && !(window.scrollY <= 5 && e.deltaY < 0)) return;
			e.preventDefault();
			const next = Math.min(Math.max(progressRef.current + e.deltaY * 0.0009, 0), 1);
			applyProgress(next);
		};

		const handleTouchStart = (e: TouchEvent) => {
			touchStartYRef.current = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const touchY = e.touches[0].clientY;
			const deltaY = touchStartYRef.current - touchY;
			if (expandedRef.current && !(window.scrollY <= 5 && deltaY < 0)) return;
			e.preventDefault();
			const factor = !expandedRef.current && deltaY > 0 ? 0.005 : 0.008;
			const next = Math.min(Math.max(progressRef.current + deltaY * factor, 0), 1);
			applyProgress(next);
			touchStartYRef.current = touchY;
		};

		const handleScroll = () => {
			if (!expandedRef.current && window.scrollY > 0) window.scrollTo(0, 0);
		};

		window.addEventListener("wheel", handleWheel, { passive: false });
		window.addEventListener("touchstart", handleTouchStart, { passive: false });
		window.addEventListener("touchmove", handleTouchMove, { passive: false });
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("wheel", handleWheel);
			window.removeEventListener("touchstart", handleTouchStart);
			window.removeEventListener("touchmove", handleTouchMove);
			window.removeEventListener("scroll", handleScroll);
		};
	}, [applyProgress]);

	const mediaW = 300 + progress * (isMobile ? 650 : 1250);
	const mediaH = 400 + progress * (isMobile ? 200 : 400);
	const mediaRadius = 24 * (1 - progress);
	const textShift = progress * (isMobile ? 180 : 150);
	const bgOpacity = 1 - progress;
	const hintOpacity = Math.max(0, 1 - progress * 3.5);
	const ctaOpacity = progress >= 1 ? 1 : 0;

	return (
		<section className="relative min-h-dvh overflow-hidden">
			{/* Background photo — fades out as media expands */}
			<img
				alt="Pemandangan alam pegunungan dan sawah Kabut Tipis"
				className="absolute inset-0 size-full object-cover"
				src={HERO_IMAGE}
				style={{ opacity: bgOpacity, transition: "none" }}
			/>

			<div className="absolute inset-0 bg-foreground/25" />
			<div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-foreground/35 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

			<div className="relative flex h-dvh flex-col items-center justify-center px-5 pt-16 text-center">
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl shadow-foreground/25 ring-1 ring-background/40"
					style={{
						width: `min(${mediaW}px, 95vw)`,
						height: `min(${mediaH}px, 88vh)`,
						borderRadius: `${mediaRadius}px`,
						transition: "none",
					}}
				>
					<video
						autoPlay
						className="size-full object-cover"
						loop
						muted
						playsInline
						src={VIDEO_SRC}
					/>
					<div
						className="absolute inset-0 bg-foreground/30"
						style={{
							opacity: Math.max(0, 0.3 - progress * 0.2),
							transition: "none",
						}}
					/>
				</div>

				<div className="relative z-10 flex flex-col items-center gap-0 text-[clamp(3.8rem,13vw,11rem)] text-primary-foreground leading-none md:flex-row md:gap-8">
					<h1
						className="font-extrabold drop-shadow-2xl"
						style={{
							transform: `translateX(-${textShift}vw)`,
							transition: "none",
						}}
					>
						Kabut
					</h1>
					<h1
						className="font-extrabold drop-shadow-2xl"
						style={{
							transform: `translateX(${textShift}vw)`,
							transition: "none",
						}}
					>
						Tipis
					</h1>
				</div>

				<div
					className="relative z-10 mt-4 flex flex-col items-center gap-3 sm:flex-row"
					style={{ opacity: hintOpacity, transition: "opacity 0.15s" }}
				>
					<p className="font-semibold text-primary-foreground/90 text-sm uppercase tracking-normal">
						Coffeeshop, rekreasi, dan penginapan alam
					</p>
					<span className="flex items-center gap-2 text-primary-foreground/75 text-sm">
						<ArrowDown className="size-4 animate-bounce" />
						Scroll untuk Menjelajahi
					</span>
				</div>

				<div
					className="relative z-10 mt-6 flex flex-col items-center gap-3 sm:flex-row"
					style={{ opacity: ctaOpacity, transition: "opacity 0.5s" }}
				>
					<a className={buttonVariants({ size: "lg" })} href="/reservation">
						<CalendarCheck data-icon="inline-start" />
						Reservasi Sekarang
					</a>
				</div>
			</div>
		</section>
	);
}
