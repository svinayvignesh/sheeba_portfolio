"use client";

import { useRef } from "react";
import Image from "next/image";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Entrance animations
      gsap.from(`.${styles.nameFirst}`, {
        opacity: 0,
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        y: 100,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      gsap.from(`.${styles.nameLast}`, {
        opacity: 0,
        clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
        y: 100,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
      });

      gsap.from(`.${styles.portrait}`, {
        opacity: 0,
        scale: 1.05,
        duration: 1.2,
        ease: "power2.out",
        delay: 0.1,
      });

      gsap.from(`.${styles.title}`, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
      });

      gsap.from(`.${styles.tagline}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.65,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        duration: 0.6,
        delay: 1.2,
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

      // Portrait parallax (moves slower than scroll)
      tl.to(
        `.${styles.portrait}`,
        {
          y: 100,
          ease: "none",
        },
        0
      );

      // Content fade out and move up
      tl.to(
        `.${styles.contentWrapper}`,
        {
          opacity: 0,
          y: -80,
          ease: "none",
        },
        0
      );
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      <div className={styles.container}>
        {/* Portrait Image - Centered, Absolutely Positioned */}
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

        {/* Text Content with Layered Effect */}
        <div className={styles.contentWrapper}>
          <div className={styles.nameContainer}>
            <h1 className={styles.nameFirst}>SHEEBA</h1>
            <h1 className={styles.nameLast}>SUKUMARAN</h1>
          </div>

          <p className={styles.title}>Director of Business Transformation</p>
          <p className={styles.tagline}>
            Transforming complexity into competitive advantage through digital
            innovation, AI automation, and strategic leadership.
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollArrow}>↓</div>
      </div>
    </section>
  );
}
