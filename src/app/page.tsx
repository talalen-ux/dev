import { Container } from "@/components/layout/Container";
import { Business } from "@/components/landing/Business";
import { Close } from "@/components/landing/Close";
import { Hero } from "@/components/landing/Hero";
import { Intro } from "@/components/landing/Intro";
import { Opportunity } from "@/components/landing/Opportunity";
import { Thesis } from "@/components/landing/Thesis";
import { TokenEngine } from "@/components/landing/TokenEngine";
import { Vision } from "@/components/landing/Vision";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";

/**
 * Resident as a liquidity house: thesis, business, opportunity, token, vision,
 * close. The headline carries the first screen on its own.
 *
 * The chain strip and the stat row that used to sit under the hero are gone.
 * Both were competing with the headline for the first screen, and one of them
 * was advertising reach the House does not yet have.
 */
export default function Home() {
  return (
    <>
      {/* The gate comes first so it leads the tab order: one Tab reaches its
          enter link. It is dismissed by a `:has()` rule keyed on #main, so DOM
          order is free — see globals.css. */}
      <Intro />
      <div id="main">
        <Container>
          <SiteHeader />
          <Hero />
          <Thesis />
          <Business />
          <Opportunity />
          <TokenEngine />
          <Vision />
          <Close />
          <SiteFooter />
        </Container>
      </div>
    </>
  );
}
