import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import Timeline from "@/components/Timeline";
import Stories from "@/components/Stories";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";
import { getPortfolioData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default function Home() {
  const data = getPortfolioData();

  return (
    <>
      <ThreeBackground keywords={data.threeBackground.keywords} />
      <SmoothScroll>
        <Navbar data={data.navbar} resumePath={data.footer.resumePath} />
        <main>
          <Hero data={data.hero} />
          <Impact data={data.impact} />
          <Timeline data={data.timeline} />
          <Stories data={data.stories} />
          <Skills data={data.skills} />
          <Footer data={data.footer} />
        </main>
      </SmoothScroll>
    </>
  );
}
