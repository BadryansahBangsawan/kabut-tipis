import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";

type LightboxItem = {
	id: string;
	url: string;
	thumbnailUrl: string | null;
	title: string;
	type: "photo" | "video";
};

type LightboxProps = {
	items: LightboxItem[];
	activeIndex: number | null;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
};

export default function Lightbox({
	items,
	activeIndex,
	onClose,
	onPrev,
	onNext,
}: LightboxProps) {
	const isOpen = activeIndex !== null;
	const item = activeIndex !== null ? items[activeIndex] : null;

	useEffect(() => {
		if (!isOpen) return;

		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onPrev();
			if (e.key === "ArrowRight") onNext();
		};

		window.addEventListener("keydown", handleKey);
		document.body.style.overflow = "hidden";

		return () => {
			window.removeEventListener("keydown", handleKey);
			document.body.style.overflow = "";
		};
	}, [isOpen, onClose, onPrev, onNext]);

	return (
		<AnimatePresence>
			{isOpen && item ? (
				<motion.div
					key="lightbox"
					className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/92"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.22 }}
					onClick={onClose}
				>
					<button
						aria-label="Tutup"
						className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-background/15 text-primary-foreground transition-colors hover:bg-background/30"
						onClick={onClose}
						type="button"
					>
						<X className="size-5" />
					</button>

					<button
						aria-label="Sebelumnya"
						className="absolute left-4 flex size-10 items-center justify-center rounded-full bg-background/15 text-primary-foreground transition-colors hover:bg-background/30 md:left-6"
						onClick={(e) => {
							e.stopPropagation();
							onPrev();
						}}
						type="button"
					>
						<ChevronLeft className="size-5" />
					</button>

					<motion.div
						key={item.id}
						className="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center"
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.96 }}
						transition={{ duration: 0.2 }}
						onClick={(e) => e.stopPropagation()}
					>
						{item.type === "video" ? (
							<video
								key={item.url}
								autoPlay
								className="max-h-[85vh] max-w-[85vw] rounded-sm object-contain shadow-2xl"
								controls
								loop
								src={item.url}
							/>
						) : (
							<img
								alt={item.title}
								className="max-h-[85vh] max-w-[85vw] rounded-sm object-contain shadow-2xl"
								src={item.url}
							/>
						)}
						{item.title ? (
							<p className="absolute right-0 bottom-0 left-0 rounded-b-sm bg-gradient-to-t from-foreground/60 to-transparent px-4 pt-8 pb-4 text-center text-primary-foreground text-sm">
								{item.title}
							</p>
						) : null}
					</motion.div>

					<button
						aria-label="Berikutnya"
						className="absolute right-4 flex size-10 items-center justify-center rounded-full bg-background/15 text-primary-foreground transition-colors hover:bg-background/30 md:right-6"
						onClick={(e) => {
							e.stopPropagation();
							onNext();
						}}
						type="button"
					>
						<ChevronRight className="size-5" />
					</button>

					<p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-primary-foreground/60 text-xs tabular-nums">
						{activeIndex !== null ? activeIndex + 1 : 0} / {items.length}
					</p>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}
