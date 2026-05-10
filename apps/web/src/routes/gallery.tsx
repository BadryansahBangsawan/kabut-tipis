import type { AppRouter } from "@kabut-tipis/api/routers/index";
import { Skeleton } from "@kabut-tipis/ui/components/skeleton";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { inferRouterOutputs } from "@trpc/server";
import { ImageIcon, VideoIcon } from "lucide-react";
import { Suspense, useState } from "react";

import Lightbox from "../components/sections/lightbox";
import { useTRPC } from "../utils/trpc";

type RouterOutputs = inferRouterOutputs<AppRouter>;
type GalleryItem = RouterOutputs["gallery"]["list"][number];

type FilterTab = {
	id: string;
	label: string;
	category?: string;
	type?: "photo" | "video";
};

const FILTER_TABS: FilterTab[] = [
	{ id: "all", label: "Semua" },
	{ id: "photo", label: "Foto", type: "photo" },
	{ id: "video", label: "Video", type: "video" },
	{ id: "rekreasi", label: "Area Rekreasi", category: "rekreasi" },
	{ id: "coffeeshop", label: "Coffeeshop", category: "coffeeshop" },
	{ id: "penginapan", label: "Penginapan", category: "penginapan" },
];

export const Route = createFileRoute("/gallery")({
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			context.trpc.gallery.list.queryOptions(),
		),
	component: GalleryPage,
});

function GalleryPage() {
	return (
		<div className="min-h-screen bg-background px-5 pt-28 pb-20">
			<div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
				<div className="flex flex-col gap-4 text-center">
					<p className="font-semibold text-primary text-sm uppercase tracking-normal">
						Galeri
					</p>
					<h1 className="font-bold text-4xl leading-tight md:text-5xl">
						Foto dan video dari Kabut Tipis.
					</h1>
					<p className="mx-auto max-w-xl text-muted-foreground text-sm leading-7 md:text-base">
						Sekilas suasana alam, coffeeshop, dan penginapan yang menanti
						kunjunganmu.
					</p>
				</div>

				<Suspense fallback={<GallerySkeletons />}>
					<GalleryContent />
				</Suspense>
			</div>
		</div>
	);
}

function GalleryContent() {
	const trpc = useTRPC();
	const { data: items } = useSuspenseQuery(trpc.gallery.list.queryOptions());
	const [activeTab, setActiveTab] = useState("all");
	const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

	const filtered = items.filter((item) => {
		const tab = FILTER_TABS.find((t) => t.id === activeTab);
		if (!tab || tab.id === "all") return true;
		if (tab.type) return item.type === tab.type;
		if (tab.category) return item.category === tab.category;
		return true;
	});

	const handleOpen = (index: number) => setLightboxIndex(index);
	const handleClose = () => setLightboxIndex(null);
	const handlePrev = () =>
		setLightboxIndex((i) =>
			i === null ? null : (i - 1 + filtered.length) % filtered.length,
		);
	const handleNext = () =>
		setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));

	return (
		<>
			{/* Filter tabs */}
			<div className="flex flex-wrap gap-2">
				{FILTER_TABS.map((tab) => (
					<button
						key={tab.id}
						className={cn(
							"rounded-full border px-4 py-1.5 font-medium text-sm transition-colors",
							activeTab === tab.id
								? "border-primary bg-primary text-primary-foreground"
								: "border-border bg-background text-muted-foreground hover:border-primary/60 hover:text-foreground",
						)}
						onClick={() => setActiveTab(tab.id)}
						type="button"
					>
						{tab.label}
					</button>
				))}
			</div>

			{/* Gallery grid */}
			{filtered.length === 0 ? (
				<EmptyState />
			) : (
				<div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
					{filtered.map((item, index) => (
						<GalleryCard
							key={item.id}
							item={item}
							onClick={() => handleOpen(index)}
						/>
					))}
				</div>
			)}

			<Lightbox
				activeIndex={lightboxIndex}
				items={filtered}
				onClose={handleClose}
				onNext={handleNext}
				onPrev={handlePrev}
			/>
		</>
	);
}

function GalleryCard({
	item,
	onClick,
}: {
	item: GalleryItem;
	onClick: () => void;
}) {
	const thumb = item.thumbnailUrl ?? item.url;

	return (
		<button
			className="group mb-4 block w-full overflow-hidden rounded-sm border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			onClick={onClick}
			type="button"
		>
			<div className="relative overflow-hidden">
				<img
					alt={item.title}
					className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
					loading="lazy"
					src={thumb}
				/>
				<div className="absolute inset-0 bg-foreground/0 transition-colors duration-300 group-hover:bg-foreground/20" />
				{item.type === "video" && (
					<div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-foreground/60 px-2.5 py-1 text-primary-foreground text-xs">
						<VideoIcon className="size-3" />
						Video
					</div>
				)}
				{item.type === "photo" && (
					<div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-foreground/40 px-2.5 py-1 text-primary-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
						<ImageIcon className="size-3" />
						Lihat
					</div>
				)}
			</div>
			{item.title && (
				<div className="px-3 py-2.5 text-left">
					<p className="font-medium text-foreground text-sm">{item.title}</p>
					{item.description && (
						<p className="mt-0.5 text-muted-foreground text-xs">
							{item.description}
						</p>
					)}
				</div>
			)}
		</button>
	);
}

function GallerySkeletons() {
	return (
		<div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
			{Array.from({ length: 9 }).map((_, i) => (
				<div key={i} className="mb-4">
					<Skeleton
						className="w-full rounded-sm"
						style={{ height: `${180 + (i % 3) * 80}px` }}
					/>
				</div>
			))}
		</div>
	);
}

function EmptyState() {
	return (
		<div className="flex flex-col items-center gap-4 py-20 text-center">
			<div className="flex size-14 items-center justify-center rounded-full bg-muted">
				<ImageIcon className="size-6 text-muted-foreground" />
			</div>
			<p className="font-medium text-foreground">Belum ada galeri</p>
			<p className="text-muted-foreground text-sm">
				Foto dan video akan ditampilkan di sini.
			</p>
		</div>
	);
}
