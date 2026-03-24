"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import ScrollVideo from "./ScrollVideo";
import styles from "./Hero.module.css";

export default function Hero() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // Parallax zoom on overlay
      tl.to(
        `.${styles.overlay}`,
        {
          opacity: 0.9,
          ease: "none",
        },
        0
      );

      // Fade out content as you scroll past
      tl.to(
        `.${styles.content}`,
        {
          opacity: 0,
          y: -60,
          ease: "none",
        },
        0.3
      );

      // Entry animations (non-scrubbed)
      gsap.from(`.${styles.name}`, {
        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(`.${styles.title}`, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(`.${styles.tagline}`, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        delay: 0.9,
      });

      gsap.from(`.${styles.tags}`, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power3.out",
        delay: 1.2,
      });

      gsap.from(`.${styles.scrollIndicator}`, {
        opacity: 0,
        duration: 0.6,
        delay: 1.8,
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.hero} id="hero">
      <ScrollVideo
        src="/videos/Modern_Office_Building_Data_Flow.mp4"
        triggerRef={sectionRef}
        start="top top"
        end="bottom top"
        className={styles.videoBg}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h1 className={styles.name}>SHEEBA SUKUMARAN</h1>
        <p className={styles.title}>
          Director of Business Transformation — Data & Technology
        </p>
        <p className={styles.tagline}>
          Turning complexity into competitive advantage through digital
          transformation, AI automation, and strategic innovation.
        </p>
        <div className={styles.tags}>
          <span className={styles.tag}>M&A Integration</span>
          <span className={styles.tagDot}>·</span>
          <span className={styles.tag}>AI Automation</span>
          <span className={styles.tagDot}>·</span>
          <span className={styles.tag}>Process Innovation</span>
          <span className={styles.tagDot}>·</span>
          <span className={styles.tag}>Digital Strategy</span>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <span className={styles.scrollText}>SCROLL</span>
        <div className={styles.scrollArrow}>↓</div>
      </div>
    </section>
  );
}
