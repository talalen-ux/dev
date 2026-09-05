import { Container } from "@/components/layout/Container";
import { AnchorNav } from "@/components/sections/AnchorNav";
import { Benefits } from "@/components/sections/Benefits";
import { DocsCta } from "@/components/sections/DocsCta";
import { Faqs } from "@/components/sections/Faqs";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Roadmap } from "@/components/sections/Roadmap";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Team } from "@/components/sections/Team";
import { TokenTicker } from "@/components/sections/TokenTicker";
import { Tokenomics } from "@/components/sections/Tokenomics";
import { ValueProps } from "@/components/sections/ValueProps";
import { Wordmark } from "@/components/sections/Wordmark";

export default function Home() {
  return (
    <Container>
      <SiteHeader />
      <TokenTicker />
      <Hero />
      <AnchorNav />
      <ValueProps />
      <HowItWorks />
      <Features />
      <Benefits />
      <Roadmap />
      <Team />
      <Tokenomics />
      <Faqs />
      <DocsCta />
      <Wordmark />
      <SiteFooter />
    </Container>
  );
}
