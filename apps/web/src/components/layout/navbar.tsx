import { cn } from "@kabut-tipis/ui/lib/utils";
import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
	label: string;
	id: string;
	href: string;
};

const NAV_ITEMS: NavItem[] = [
	{ label: "Home", id: "home", href: "/" },
	{ label: "Galeri", id: "gallery", href: "/gallery" },
	{ label: "Layanan", id: "services", href: "/services" },
	{ label: "Reservasi", id: "reservation", href: "/reservation" },
	{ label: "Kontak", id: "contact", href: "/contact" },
];

function resolveActiveItem(pathname: string) {
	if (pathname === "/") {
		return NAV_ITEMS[0];
	}

	return (
		NAV_ITEMS.find(
			(item) => item.href !== "/" && pathname.startsWith(item.href),
		) ?? NAV_ITEMS[0]
	);
}

export default function Navbar() {
	const location = useLocation();
	const activeItem = useMemo(
		() => resolveActiveItem(location.pathname),
		[location.pathname],
	);
	const [expanded, setExpanded] = useState(false);
	const [hovering, setHovering] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pillWidth = useSpring(150, { stiffness: 220, damping: 25, mass: 1 });

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		if (isMobile) {
			setExpanded(true);
			return;
		}

		if (hovering) {
			setExpanded(true);
			pillWidth.set(610);

			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		} else {
			closeTimeoutRef.current = setTimeout(() => {
				setExpanded(false);
				pillWidth.set(150);
			}, 400);
		}

		return () => {
			if (closeTimeoutRef.current) {
				clearTimeout(closeTimeoutRef.current);
			}
		};
	}, [hovering, isMobile, pillWidth]);

	const expandedNav = expanded || isMobile;

	return (
		<div className="fixed inset-x-0 top-4 z-50 flex justify-center px-3">
			<motion.nav
				aria-label="Navigasi utama"
				className="relative max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-full border border-white/70"
				onMouseEnter={() => !isMobile && setHovering(true)}
				onMouseLeave={() => !isMobile && setHovering(false)}
				style={{
					width: isMobile ? "min(92vw, 440px)" : pillWidth,
					height: isMobile ? 52 : 56,
					background:
						"linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(245,245,240,0.94) 48%, rgba(232,235,226,0.96) 100%)",
					boxShadow:
						"0 18px 45px rgba(26, 26, 26, 0.16), inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -2px 8px rgba(26,26,26,0.12)",
					backdropFilter: "blur(18px)",
				}}
			>
				<div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white/90" />
				<div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/60 via-transparent to-black/5" />

				<div className="relative z-10 flex h-full items-center justify-center px-3">
					<AnimatePresence mode="wait">
						{!expandedNav ? (
							<motion.a
								key={activeItem.id}
								href={activeItem.href}
								className="truncate font-semibold text-foreground text-sm"
								initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
								animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
								transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
							>
								{activeItem.label}
							</motion.a>
						) : (
							<motion.div
								key="expanded"
								className="flex w-full items-center justify-evenly gap-1"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.18 }}
							>
								{NAV_ITEMS.map((item, index) => {
									const isActive = item.id === activeItem.id;

									return (
										<motion.a
											key={item.id}
											href={item.href}
											className={cn(
												"rounded-full px-2.5 py-2 font-semibold text-xs transition-colors sm:px-4 sm:text-sm",
												isActive
													? "text-primary"
													: "text-muted-foreground hover:text-foreground",
											)}
											initial={{ opacity: 0, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												delay: index * 0.045,
												duration: 0.2,
												ease: "easeOut",
											}}
											onClick={() => {
												if (!isMobile) {
													setHovering(false);
												}
											}}
										>
											{item.label}
										</motion.a>
									);
								})}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</motion.nav>
		</div>
	);
}
