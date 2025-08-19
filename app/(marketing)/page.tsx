import HeroLanding from "@/components/sections/hero-landing";
import FeaturesLanding from "@/components/sections/features-landing";
import PreviewLanding from "@/components/sections/preview-landing";
import CTASection from "@/components/sections/cta-section";

export default function IndexPage() {
  return (
    <>
      <HeroLanding />
      <FeaturesLanding />
      <PreviewLanding />
      <CTASection />
    </>
  );
}
