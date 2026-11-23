import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/services/featured-services";
import { ServiceCategories } from "@/components/home/service-categories";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { Faq } from "@/components/home/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedServices />
      <ServiceCategories />
      <HowItWorks />
      <WhyChooseUs />
      <Faq />
    </>
  );
}