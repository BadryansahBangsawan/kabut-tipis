import { z } from "zod";

export const RESERVATION_TIME_ZONE = "Asia/Makassar";
export const RESERVATION_DEDUP_WINDOW_MS = 10 * 60 * 1000;

const RESERVATION_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RESERVATION_RATE_LIMIT_MAX_ATTEMPTS = 8;

const reservationRateLimits = new Map<
	string,
	{ count: number; resetAt: number }
>();

export const phoneSchema = z
	.string()
	.regex(/^(08|62|\+62)\d{8,13}$/, "Nomor WhatsApp tidak valid");

export function getLocalDateKey(
	date = new Date(),
	timeZone = RESERVATION_TIME_ZONE,
) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		day: "2-digit",
		month: "2-digit",
		timeZone,
		year: "numeric",
	}).formatToParts(date);

	const values = Object.fromEntries(
		parts
			.filter((part) => part.type !== "literal")
			.map((part) => [part.type, part.value]),
	);

	return `${values.year}-${values.month}-${values.day}`;
}

function isCalendarDate(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

	const [yearString, monthString, dayString] = value.split("-");
	if (!yearString || !monthString || !dayString) return false;

	const year = Number(yearString);
	const month = Number(monthString);
	const day = Number(dayString);
	const date = new Date(Date.UTC(year, month - 1, day));

	return (
		date.getUTCFullYear() === year &&
		date.getUTCMonth() === month - 1 &&
		date.getUTCDate() === day
	);
}

function isTodayOrFuture(value: string) {
	return value >= getLocalDateKey();
}

export const createReservationInput = z.object({
	name: z.string().trim().min(3),
	phone: phoneSchema,
	date: z
		.string()
		.min(1)
		.refine(isCalendarDate, "Tanggal reservasi tidak valid")
		.refine(isTodayOrFuture, "Tanggal tidak boleh di masa lalu"),
	guestCount: z.number().int().min(1).max(100),
	packageId: z.string().min(1),
	notes: z.string().trim().max(500).optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationInput>;

export function normalizeReservationPhone(phone: string) {
	const digits = phone.replace(/\D/g, "");

	if (digits.startsWith("62")) {
		return `0${digits.slice(2)}`;
	}

	return digits;
}

export function createReservationSignature({
	phone,
	date,
	packageId,
}: Pick<CreateReservationInput, "phone" | "date" | "packageId">) {
	return `${normalizeReservationPhone(phone)}:${date}:${packageId}`;
}

function getReservationClientKey(request: Request) {
	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0];

	return (
		request.headers.get("cf-connecting-ip") ??
		forwardedFor?.trim() ??
		request.headers.get("x-real-ip") ??
		"anonymous"
	);
}

export function checkReservationRateLimit(request: Request, now = Date.now()) {
	const key = getReservationClientKey(request);
	const current = reservationRateLimits.get(key);

	if (!current || current.resetAt <= now) {
		reservationRateLimits.set(key, {
			count: 1,
			resetAt: now + RESERVATION_RATE_LIMIT_WINDOW_MS,
		});
		return { allowed: true, retryAfterSeconds: 0 };
	}

	if (current.count >= RESERVATION_RATE_LIMIT_MAX_ATTEMPTS) {
		return {
			allowed: false,
			retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
		};
	}

	current.count += 1;
	return { allowed: true, retryAfterSeconds: 0 };
}
