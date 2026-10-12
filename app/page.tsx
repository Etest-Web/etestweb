import Hero from "@/components/home/hero";
import Details from "@/components/home/details";
import ThirdSection from "@/components/home/section";
import Process from "@/components/home/process";
import CTA from "@/components/home/cta";

export default function Home() {
  return (
    <main>
      <Hero />
      <Details />
      <ThirdSection />
      <Process />
      <CTA />
    </main>
  );
}