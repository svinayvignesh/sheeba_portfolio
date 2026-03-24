"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Portrait fades in first
      gsap.from(`.${styles.portrait}`, {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.1,
      });

      // Title appears shortly after portrait
      gsap.from(`.${styles.title}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6,
      });

      gsap.from(`.${styles.tagline}`, {
        opacity: 0,
        y: 15,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.8,
      });

      // Name fades in after a beat — clean, dramatic
      gsap.from(`.${styles.nameFirst}`, {
        opacity: 0,
        duration: 1.6,
        ease: "power2.inOut",
        delay: 1.4,
      });

      gsap.from(`.${styles.nameLast}`, {
        opacity: 0,
        duration: 1.6,
        ease: "power2.inOut",
        delay: 1.7,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        duration: 0.6,
        delay: 2.4,
      });

      // Scroll animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: false,
        },
      });

      tl.to(
        `.${styles.portrait}`,
        { y: 100, ease: "none" },
        0
      );

      tl.to(
        `.${styles.centerContent}`,
        { opacity: 0, y: -50, ease: "none" },
        0
      );

      tl.to(
        `.${styles.nameFirst}`,
        { y: -80, opacity: 0, ease: "none" },
        0
      );

      tl.to(
        `.${styles.nameLast}`,
        { y: 80, opacity: 0, ease: "none" },
        0
      );
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      <div className={styles.container}>
        {/* Name — ABOVE portrait */}
        <h1 className={styles.nameFirst}>SHEEBA</h1>

        {/* Portrait + center content cluster */}
        <div className={styles.centerBlock}>
          <div className={styles.portraitWrapper}>
            <Image
              src="/images/Sheeba Sukumaran.jpeg"
              alt="Sheeba Sukumaran"
              width={600}
              height={800}
              priority
              className={styles.portrait}
            />
          </div>

          <div className={styles.centerContent}>
            <p className={styles.title}>Director of Business Transformation</p>
            <p className={styles.tagline}>
              Transforming complexity into competitive advantage through digital
              innovation, AI automation, and strategic leadership.
            </p>
          </div>
        </div>

        {/* Name — BELOW portrait */}
        <h1 className={styles.nameLast}>SUKUMARAN</h1>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollArrow}>↓</div>
      </div>
    </section>
  );
}
