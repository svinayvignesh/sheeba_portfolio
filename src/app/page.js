import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import Timeline from "@/components/Timeline";
import Stories from "@/components/Stories";
import Skills from "@/components/Skills";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  return (
    <>
      <ThreeBackground />
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <Impact />
          <Timeline />
          <Stories />
          <Skills />
          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
