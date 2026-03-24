import SmoothScroll from "@/components/SmoothScroll";
import FloatingElements from "@/components/FloatingElements";
import Hero from "@/components/Hero";
import Impact from "@/components/Impact";
import Timeline from "@/components/Timeline";
import Stories from "@/components/Stories";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <FloatingElements />
      <main>
        <Hero />
        <Impact />
        <Timeline />
        <Stories />
        <Skills />
        <Education />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
