import { createFileRoute } from "@tanstack/react-router";

import AboutSnippet from "@/components/sections/about-snippet";
import Hero from "@/components/sections/hero";
import Pricing from "@/components/sections/pricing";
import ReservationCTA from "@/components/sections/reservation-cta";
import ServicesPreview from "@/components/sections/services-preview";
import Testimonials from "@/components/sections/testimonials";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return (
		<>
			<Hero />
			<AboutSnippet />
			<ServicesPreview />
			<Pricing />
			<Testimonials />
			<ReservationCTA />
		</>
	);
}
