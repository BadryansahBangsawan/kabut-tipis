import { cn } from "@kabut-tipis/ui/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp, Camera, MapPin, MessageCircle } from "lucide-react";
import * as React from "react";
import { useEffect, useRef } from "react";

type MagneticButtonProps = {
	children: React.ReactNode;
	className?: string;
	href?: string;
	onClick?: () => void;
	rel?: string;
	target?: React.HTMLAttributeAnchorTarget;
	type?: "button" | "submit" | "reset";
	"aria-label"?: string;
};

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
	(
		{
			children,
			className,
			href,
			onClick,
			rel,
			target,
			type = "button",
			"aria-label": ariaLabel,
		},
		forwardedRef,
	) => {
		const localRef = useRef<HTMLElement | null>(null);

		useEffect(() => {
			const element = localRef.current;

			if (!element) {
				return;
			}

			const handleMouseMove = (event: MouseEvent) => {
				const rect = element.getBoundingClientRect();
				const x = event.clientX - rect.left - rect.width / 2;
				const y = event.clientY - rect.top - rect.height / 2;

				gsap.to(element, {
					x: x * 0.28,
					y: y * 0.28,
					scale: 1.03,
					duration: 0.35,
					ease: "power2.out",
				});
			};

			const handleMouseLeave = () => {
				gsap.to(element, {
					x: 0,
					y: 0,
					scale: 1,
					duration: 0.8,
					ease: "elastic.out(1, 0.35)",
				});
			};

			element.addEventListener("mousemove", handleMouseMove);
			element.addEventListener("mouseleave", handleMouseLeave);

			return () => {
				element.removeEventListener("mousemove", handleMouseMove);
				element.removeEventListener("mouseleave", handleMouseLeave);
			};
		}, []);

		const setRef = (node: HTMLElement | null) => {
			localRef.current = node;

			if (typeof forwardedRef === "function") {
				forwardedRef(node);
			} else if (forwardedRef) {
				forwardedRef.current = node;
			}
		};

		const classes = cn(
			"inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-5 py-3 font-semibold text-foreground text-sm shadow-foreground/5 shadow-lg backdrop-blur transition-colors hover:bg-muted",
			className,
		);

		if (href) {
			return (
				<a
					ref={setRef as React.Ref<HTMLAnchorElement>}
					className={classes}
					href={href}
					rel={rel}
					target={target}
				>
					{children}
				</a>
			);
		}

		return (
			<button
				ref={setRef as React.Ref<HTMLButtonElement>}
				aria-label={ariaLabel}
				className={classes}
				onClick={onClick}
				type={type}
			>
				{children}
			</button>
		);
	},
);

MagneticButton.displayName = "MagneticButton";

function MarqueeItem() {
	return (
		<div className="flex items-center gap-8 px-4">
			<span>Alam yang Asri</span>
			<span className="text-primary">*</span>
			<span>Udara Segar</span>
			<span className="text-primary">*</span>
			<span>Pemandangan Gunung</span>
			<span className="text-primary">*</span>
			<span>Aliran Sungai</span>
			<span className="text-primary">*</span>
		</div>
	);
}

export default function Footer() {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const giantTextRef = useRef<HTMLDivElement>(null);
	const headingRef = useRef<HTMLHeadingElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		gsap.registerPlugin(ScrollTrigger);

		if (!wrapperRef.current) {
			return;
		}

		const ctx = gsap.context(() => {
			gsap.fromTo(
				giantTextRef.current,
				{ y: "10vh", scale: 0.92, opacity: 0 },
				{
					y: "0vh",
					scale: 1,
					opacity: 1,
					ease: "power1.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 80%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);

			gsap.fromTo(
				[headingRef.current, linksRef.current],
				{ y: 42, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					stagger: 0.12,
					ease: "power3.out",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: "top 55%",
						end: "bottom bottom",
						scrub: 1,
					},
				},
			);
		}, wrapperRef);

		return () => ctx.revert();
	}, []);

	const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

	return (
		<div
			ref={wrapperRef}
			className="relative h-[92vh] w-full"
			style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
		>
			<footer className="fixed bottom-0 left-0 flex h-[92vh] w-full flex-col justify-between overflow-hidden bg-background text-foreground">
				<div className="kabut-footer-grid pointer-events-none absolute inset-0" />
				<div
					ref={giantTextRef}
					className="kabut-footer-giant pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 select-none whitespace-nowrap"
				>
					KABUT TIPIS
				</div>

				<div className="absolute top-12 left-0 w-full -rotate-2 scale-110 overflow-hidden border-border border-y bg-background/80 py-4 shadow-2xl backdrop-blur">
					<div className="kabut-footer-marquee flex w-max font-bold text-muted-foreground text-xs uppercase tracking-normal md:text-sm">
						<MarqueeItem />
						<MarqueeItem />
						<MarqueeItem />
						<MarqueeItem />
					</div>
				</div>

				<div className="relative z-10 mx-auto mt-20 flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 text-center">
					<h2
						ref={headingRef}
						className="max-w-3xl font-extrabold text-4xl text-foreground md:text-7xl"
					>
						Reservasi suasana alam Kabut Tipis
					</h2>

					<div
						ref={linksRef}
						className="mt-10 flex w-full flex-col items-center gap-5"
					>
						<div className="flex flex-wrap justify-center gap-3">
							<MagneticButton
								href="https://wa.me/6285245055567"
								rel="noreferrer"
								target="_blank"
							>
								<MessageCircle data-icon="inline-start" />
								WhatsApp
							</MagneticButton>
							<MagneticButton
								href="https://www.instagram.com/kabutipiscampsite"
								rel="noreferrer"
								target="_blank"
							>
								<Camera data-icon="inline-start" />
								Instagram
							</MagneticButton>
							<MagneticButton
								href="https://maps.app.goo.gl/pqquk98eyFmz2j4j8"
								rel="noreferrer"
								target="_blank"
							>
								<MapPin data-icon="inline-start" />
								Maps
							</MagneticButton>
						</div>
					</div>
				</div>

				<div className="relative z-20 flex w-full flex-col items-center justify-between gap-4 px-6 pb-8 text-center md:flex-row md:px-12">
					<div className="font-semibold text-muted-foreground text-xs uppercase">
						(c) 2026 Kabut Tipis. All rights reserved.
					</div>
					<MagneticButton
						aria-label="Kembali ke atas"
						className="size-12 p-0"
						onClick={scrollToTop}
					>
						<ArrowUp />
					</MagneticButton>
				</div>
			</footer>
		</div>
	);
}
