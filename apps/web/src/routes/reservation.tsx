import { Input } from "@kabut-tipis/ui/components/input";
import { Label } from "@kabut-tipis/ui/components/label";
import { Skeleton } from "@kabut-tipis/ui/components/skeleton";
import { cn } from "@kabut-tipis/ui/lib/utils";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import {
	CalendarCheck,
	CheckCircle2,
	Loader2,
	MessageCircle,
} from "lucide-react";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useTRPC } from "../utils/trpc";

// ─── Route ─────────────────────────────────────────────────────────────────
export const Route = createFileRoute("/reservation")({
	validateSearch: z.object({ paket: z.string().optional() }),
	loader: ({ context }) =>
		context.queryClient.ensureQueryData(
			context.trpc.packages.list.queryOptions(),
		),
	component: ReservationPage,
});

// ─── Zod validation schema ──────────────────────────────────────────────────
const reservationSchema = z.object({
	name: z.string().trim().min(3, "Nama minimal 3 karakter"),
	phone: z.string().regex(/^(08|62|\+62)\d{8,13}$/, "Format: 08xx atau 628xx"),
	date: z
		.string()
		.min(1, "Tanggal wajib diisi")
		.refine((d) => new Date(d) >= new Date(new Date().toDateString()), {
			message: "Tanggal tidak boleh di masa lalu",
		}),
	guestCount: z
		.number()
		.int("Masukkan angka bulat")
		.min(1, "Minimal 1 tamu")
		.max(100, "Maksimal 100 tamu"),
	packageId: z.string().min(1, "Pilih paket"),
	notes: z.string().trim().max(500).optional(),
});

type FormFields = z.infer<typeof reservationSchema>;
type FormErrors = Partial<Record<keyof FormFields, string>>;

// ─── WA message builder ─────────────────────────────────────────────────────
function buildWhatsAppUrl(
	data: FormFields,
	packageName: string,
	packagePrice: string,
) {
	const date = new Date(data.date).toLocaleDateString("id-ID", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const text = [
		"Halo Kabut Tipis! 👋",
		"",
		"Saya ingin melakukan reservasi:",
		`• Nama: ${data.name}`,
		`• Tanggal: ${date}`,
		`• Jumlah Tamu: ${data.guestCount} orang`,
		`• Paket: ${packageName} (${packagePrice})`,
		data.notes ? `• Catatan: ${data.notes}` : null,
		"",
		"Mohon konfirmasinya, terima kasih! 🙏",
	]
		.filter((line) => line !== null)
		.join("\n");

	return `https://wa.me/6281234567890?text=${encodeURIComponent(text)}`;
}

// ─── Page ───────────────────────────────────────────────────────────────────
function ReservationPage() {
	return (
		<div className="min-h-screen bg-background px-5 pt-28 pb-20">
			<div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_380px]">
				{/* Left: header + info */}
				<div className="flex flex-col gap-8">
					<div className="flex flex-col gap-4">
						<p className="flex items-center gap-2 font-semibold text-primary text-sm uppercase tracking-normal">
							<CalendarCheck className="size-4" />
							Reservasi
						</p>
						<h1 className="font-bold text-4xl leading-tight md:text-5xl">
							Isi form lalu konfirmasi via WhatsApp.
						</h1>
						<p className="max-w-xl text-muted-foreground text-sm leading-7 md:text-base">
							Reservasi Kabut Tipis dilakukan lewat WhatsApp. Isi form di bawah,
							lalu klik tombol konfirmasi — pesan sudah siap terkirim.
						</p>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						{[
							{
								icon: CalendarCheck,
								title: "Pilih tanggal & paket",
								desc: "Tentukan jadwal dan paket kunjungan.",
							},
							{
								icon: MessageCircle,
								title: "Konfirmasi via WhatsApp",
								desc: "Satu klik, pesan langsung terkirim ke kami.",
							},
							{
								icon: CheckCircle2,
								title: "Tunggu konfirmasi",
								desc: "Tim kami akan membalas dalam waktu singkat.",
							},
						].map(({ icon: Icon, title, desc }) => (
							<div
								key={title}
								className="flex gap-3 rounded-sm border border-border p-4"
							>
								<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
									<Icon className="size-4 text-primary" />
								</span>
								<div>
									<p className="font-semibold text-sm">{title}</p>
									<p className="text-muted-foreground text-xs">{desc}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right: form */}
				<Suspense fallback={<FormSkeleton />}>
					<ReservationForm />
				</Suspense>
			</div>
		</div>
	);
}

// ─── Form ───────────────────────────────────────────────────────────────────
function ReservationForm() {
	const search = useSearch({ from: "/reservation" });
	const trpc = useTRPC();

	const { data: packages } = useSuspenseQuery(
		trpc.packages.list.queryOptions(),
	);

	const [fields, setFields] = useState<Partial<FormFields>>({
		packageId: search.paket ?? "",
		guestCount: 1,
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [submitted, setSubmitted] = useState(false);

	const mutation = useMutation(
		trpc.reservation.create.mutationOptions({
			onSuccess: (result) => {
				const pkg = packages.find((p) => p.id === result.packageId);
				const price = pkg
					? `Rp${result.packagePrice.toLocaleString("id-ID")}`
					: "";
				const url = buildWhatsAppUrl(
					fields as FormFields,
					result.packageName,
					price,
				);
				setSubmitted(true);
				window.open(url, "_blank");
			},
			onError: (err) => {
				toast.error(err.message);
			},
		}),
	);

	const set = <K extends keyof FormFields>(key: K, value: FormFields[K]) => {
		setFields((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const result = reservationSchema.safeParse({
			...fields,
			guestCount: Number(fields.guestCount),
		});

		if (!result.success) {
			const errs: FormErrors = {};
			for (const issue of result.error.issues) {
				const key = issue.path[0] as keyof FormFields;
				if (!errs[key]) errs[key] = issue.message;
			}
			setErrors(errs);
			return;
		}

		mutation.mutate(result.data);
	};

	if (submitted) {
		return <SuccessCard onReset={() => setSubmitted(false)} />;
	}

	const today = new Date().toISOString().split("T")[0];

	return (
		<form
			className="flex flex-col gap-5 rounded-sm border border-border bg-background p-6 shadow-sm"
			onSubmit={handleSubmit}
		>
			<p className="font-semibold text-base">Detail Reservasi</p>

			{/* Nama */}
			<Field error={errors.name} label="Nama Lengkap">
				<Input
					autoComplete="name"
					onChange={(e) => set("name", e.target.value)}
					placeholder="Contoh: Budi Santoso"
					value={fields.name ?? ""}
				/>
			</Field>

			{/* WhatsApp */}
			<Field error={errors.phone} label="Nomor WhatsApp">
				<Input
					autoComplete="tel"
					inputMode="tel"
					onChange={(e) => set("phone", e.target.value)}
					placeholder="0812xxxxxxxx"
					type="tel"
					value={fields.phone ?? ""}
				/>
			</Field>

			{/* Tanggal */}
			<Field error={errors.date} label="Tanggal Kunjungan">
				<Input
					min={today}
					onChange={(e) => set("date", e.target.value)}
					type="date"
					value={fields.date ?? ""}
				/>
			</Field>

			{/* Jumlah tamu */}
			<Field error={errors.guestCount} label="Jumlah Tamu">
				<Input
					inputMode="numeric"
					max={100}
					min={1}
					onChange={(e) => set("guestCount", e.target.valueAsNumber)}
					type="number"
					value={fields.guestCount ?? ""}
				/>
			</Field>

			{/* Paket */}
			<Field error={errors.packageId} label="Pilih Paket">
				<select
					className={cn(
						"h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
						errors.packageId && "border-destructive",
					)}
					onChange={(e) => set("packageId", e.target.value)}
					value={fields.packageId ?? ""}
				>
					<option value="">-- Pilih paket --</option>
					{packages.map((pkg) => (
						<option key={pkg.id} value={pkg.id}>
							{pkg.name} — Rp{pkg.price.toLocaleString("id-ID")} /{" "}
							{pkg.duration}
						</option>
					))}
				</select>
			</Field>

			{/* Catatan */}
			<Field error={errors.notes} label="Catatan Tambahan (opsional)">
				<textarea
					className="w-full rounded-none border border-input bg-transparent px-2.5 py-1.5 text-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
					maxLength={500}
					onChange={(e) => set("notes", e.target.value)}
					placeholder="Alergi makanan, permintaan khusus, dll."
					rows={3}
					value={fields.notes ?? ""}
				/>
			</Field>

			<button
				className={cn(
					"flex items-center justify-center gap-2 rounded-none bg-primary px-4 py-2.5 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
				)}
				disabled={mutation.isPending}
				type="submit"
			>
				{mutation.isPending ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<MessageCircle className="size-4" />
				)}
				Konfirmasi via WhatsApp
			</button>

			<p className="text-center text-muted-foreground text-xs">
				Data akan dikirim sebagai pesan WhatsApp ke tim Kabut Tipis.
			</p>
		</form>
	);
}

// ─── Field wrapper ──────────────────────────────────────────────────────────
function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label className="font-medium text-xs">{label}</Label>
			{children}
			{error && <p className="text-destructive text-xs">{error}</p>}
		</div>
	);
}

// ─── Success card ───────────────────────────────────────────────────────────
function SuccessCard({ onReset }: { onReset: () => void }) {
	return (
		<div className="flex flex-col items-center gap-6 rounded-sm border border-border bg-background p-10 text-center shadow-sm">
			<span className="flex size-14 items-center justify-center rounded-full bg-accent">
				<CheckCircle2 className="size-7 text-primary" />
			</span>
			<div className="flex flex-col gap-2">
				<p className="font-bold text-lg">WhatsApp sudah terbuka!</p>
				<p className="text-muted-foreground text-sm leading-6">
					Pesan reservasi sudah siap. Tinggal kirim ke Kabut Tipis dan tunggu
					konfirmasinya.
				</p>
			</div>
			<div className="flex flex-col gap-2 sm:flex-row">
				<a
					className="inline-flex items-center justify-center gap-2 rounded-none bg-primary px-4 py-2 font-semibold text-primary-foreground text-sm transition-opacity hover:opacity-90"
					href="https://wa.me/6281234567890"
					rel="noreferrer"
					target="_blank"
				>
					<MessageCircle className="size-4" />
					Buka WhatsApp lagi
				</a>
				<button
					className="inline-flex items-center justify-center gap-2 rounded-none border border-border px-4 py-2 font-semibold text-sm transition-colors hover:bg-muted"
					onClick={onReset}
					type="button"
				>
					Reservasi baru
				</button>
			</div>
		</div>
	);
}

// ─── Skeleton ───────────────────────────────────────────────────────────────
function FormSkeleton() {
	return (
		<div className="flex flex-col gap-5 rounded-sm border border-border p-6">
			<Skeleton className="h-5 w-32" />
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className="flex flex-col gap-1.5">
					<Skeleton className="h-3.5 w-24" />
					<Skeleton className="h-8 w-full" />
				</div>
			))}
			<Skeleton className="h-10 w-full" />
		</div>
	);
}
