import { buttonVariants } from "@kabut-tipis/ui/components/button";
import { CalendarCheck, MessageCircle } from "lucide-react";

const CTA_IMAGE = "/kabut-tipis-asset/foto/4.png";

export default function ReservationCTA() {
	return (
		<section className="bg-background px-5 py-20 md:py-28">
			<div className="relative mx-auto min-h-[430px] max-w-6xl overflow-hidden rounded-md">
				<img
					alt="Lanskap hijau untuk reservasi Kabut Tipis"
					className="absolute inset-0 size-full object-cover"
					src={CTA_IMAGE}
				/>
				<div className="absolute inset-0 bg-foreground/45" />
				<div className="relative z-10 flex min-h-[430px] flex-col justify-end gap-6 p-6 text-primary-foreground md:p-10">
					<div className="flex max-w-2xl flex-col gap-4">
						<p className="flex items-center gap-2 font-semibold text-sm uppercase tracking-normal">
							<CalendarCheck />
							Reservasi
						</p>
						<h2 className="font-bold text-4xl leading-tight md:text-6xl">
							Amankan meja atau paket sebelum berangkat.
						</h2>
						<p className="text-primary-foreground/85 text-sm leading-7 md:text-base">
							Isi form reservasi dan lanjutkan konfirmasi melalui WhatsApp Kabut
							Tipis.
						</p>
					</div>
					<div>
						<a className={buttonVariants({ size: "lg" })} href="/reservation">
							<MessageCircle data-icon="inline-start" />
							Konfirmasi via WhatsApp
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
