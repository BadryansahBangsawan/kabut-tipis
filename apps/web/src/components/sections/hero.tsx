import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { ArrowDown, CalendarCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const HERO_IMAGE =
	"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=85&w=1800&auto=format&fit=crop";
const MEDIA_IMAGE =
	"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=85&w=1400&auto=format&fit=crop";

export default function Hero() {
	// Use refs for event handlers to avoid re-registering listeners on every render
	const progressRef = useRef(0);
	const expandedRef = useRef(false);
	const touchStartYRef = useRef(0);

	// State for rendering
	const [progress, setProgress] = useState(0);
	const [expanded, setExpanded] = useState(false);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const check = () => setIsMobile(window.innerWidth < 768);
		check();
		window.addEventListener("resize", check);
		return () => window.removeEventListener("resize", check);
	}, []);

	const applyProgress = useCallback((next: number) => {
		progressRef.current = next;
		setProgress(next);
		if (next >= 1 && !expandedRef.current) {
			expandedRef.current = true;
			setExpanded(true);
		} else if (next < 1 && expandedRef.current) {
			expandedRef.current = false;
			setExpanded(false);
		}
	}, []);

	useEffect(() => {
		const handleWheel = (e: WheelEvent) => {
			// Expanded + at top + scroll up → reverse animation gradually
			if (expandedRef.current && window.scrollY <= 5 && e.deltaY < 0) {
				e.preventDefault();
				const delta = e.deltaY * 0.0009;
				const next = Math.min(Math.max(progressRef.current + delta, 0), 1);
				applyProgress(next);
				return;
			}
			// Not yet expanded → intercept and build progress
			if (!expandedRef.current) {
				e.preventDefault();
				const delta = e.deltaY * 0.0009;
				const next = Math.min(Math.max(progressRef.current + delta, 0), 1);
				applyProgress(next);
			}
			// Expanded + scrolling down → let native scroll work normally
		};

		const handleTouchStart = (e: TouchEvent) => {
			touchStartYRef.current = e.touches[0].clientY;
		};

		const handleTouchMove = (e: TouchEvent) => {
			const touchY = e.touches[0].clientY;
			const deltaY = touchStartYRef.current - touchY;

			// Expanded + at top + swipe up → reverse animation gradually
			if (expandedRef.current && window.scrollY <= 5 && deltaY < 0) {
				e.preventDefault();
				const next = Math.min(
					Math.max(progressRef.current + deltaY * 0.008, 0),
					1,
				);
				applyProgress(next);
				touchStartYRef.current = touchY;
				return;
			}
			// Not yet expanded → intercept and build progress
			if (!expandedRef.current) {
				e.preventDefault();
				const factor = deltaY > 0 ? 0.005 : 0.008;
				const next = Math.min(
					Math.max(progressRef.current + deltaY * factor, 0),
					1,
				);
				applyProgress(next);
				touchStartYRef.current = touchY;
			}
		};

		// Prevent native scroll while hero is not fully expanded
		const handleScroll = () => {
			if (!expandedRef.current) window.scrollTo(0, 0);
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

	// Dimensions calculated from progress
	const mediaW = 300 + progress * (isMobile ? 650 : 1250);
	const mediaH = 400 + progress * (isMobile ? 200 : 400);
	const mediaRadius = 24 * (1 - progress);
	const textShift = progress * (isMobile ? 180 : 150);
	const bgOpacity = 1 - progress;
	const hintOpacity = Math.max(0, 1 - progress * 3.5);
	const ctaOpacity = expanded ? 1 : 0;

	return (
		<section className="relative min-h-dvh overflow-hidden">
			{/* Background image fades out as media expands */}
			<img
				alt="Pemandangan alam pegunungan dan sawah"
				className="absolute inset-0 size-full object-cover"
				src={HERO_IMAGE}
				style={{ opacity: bgOpacity, transition: "none" }}
			/>
			<div className="absolute inset-0 bg-foreground/25" />
			<div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-foreground/35 to-transparent" />
			<div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />

			{/* Main layout */}
			<div className="relative flex h-dvh flex-col items-center justify-center px-5 pt-16 text-center">
				{/* Expanding media container */}
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden shadow-2xl shadow-foreground/25 ring-1 ring-background/40"
					style={{
						width: `min(${mediaW}px, 95vw)`,
						height: `min(${mediaH}px, 88vh)`,
						borderRadius: `${mediaRadius}px`,
						transition: "none",
					}}
				>
					<img
						alt="Aliran sungai dan lanskap hijau Kabut Tipis"
						className="size-full object-cover"
						src={MEDIA_IMAGE}
					/>
					<div
						className="absolute inset-0 bg-foreground/30"
						style={{
							opacity: Math.max(0, 0.3 - progress * 0.2),
							transition: "none",
						}}
					/>
				</div>

				{/* Title — words split apart as media expands */}
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

				{/* Scroll hint — fades out early */}
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

				{/* CTA — fades in after fully expanded */}
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
