import InstitutionZone from "@/components/institution-zone/InstitutionZone";
import TrustedPartners from "@/components/institution-zone/TrustedPartners";
import ServicesSection from "@/components/institution-zone/ServicesSection";
import Testimonials from "@/components/institution-zone/Testimonials";
import Faq from "@/components/institution-zone/Faq";

export default function Page() {
  return (
    <>
      <InstitutionZone />
      <TrustedPartners />
      <ServicesSection />
      <Testimonials />
      <Faq />
    </>
  );
}
