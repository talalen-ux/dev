import { Container } from "@/components/layout/Container";
import { AnchorNav } from "@/components/sections/AnchorNav";
import { ChainStrip } from "@/components/sections/ChainStrip";
import { Custody } from "@/components/sections/Custody";
import { Cycle } from "@/components/sections/Cycle";
import { DocsCta } from "@/components/sections/DocsCta";
import { Faqs } from "@/components/sections/Faqs";
import { Hero } from "@/components/sections/Hero";
import { LpDesk } from "@/components/sections/LpDesk";
import { Method } from "@/components/sections/Method";
import { Parameters } from "@/components/sections/Parameters";
import { Payouts } from "@/components/sections/Payouts";
import { Pillars } from "@/components/sections/Pillars";
import { Signals } from "@/components/sections/Signals";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { Wordmark } from "@/components/sections/Wordmark";

export default function Home() {
  return (
    <Container>
      <SiteHeader />
      <ChainStrip />
      <Hero />
      <AnchorNav />
      <Pillars />
      <Cycle />
      <Method />
      <LpDesk />
      <Signals />
      <Payouts />
      <Custody />
      <Parameters />
      <Faqs />
      <DocsCta />
      <Wordmark />
      <SiteFooter />
    </Container>
  );
}
