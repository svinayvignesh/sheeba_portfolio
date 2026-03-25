"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Footer.module.css";

export default function Footer({ data }) {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Heading clip-path reveal
      const headingWrapper = el.querySelector(`.${styles.headingWrapper}`);
      if (headingWrapper) {
        gsap.from(headingWrapper.querySelector(`.${styles.heading}`), {
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
          opacity: 0,
          y: 100,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // Subtitle fade in
      gsap.from(`.${styles.subtitle}`, {
        scrollTrigger: { trigger: el, start: "top 75%", once: true },
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
      });

      // CTA button
      gsap.from(`.${styles.cta}`, {
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
        opacity: 0,
        scale: 0.9,
        duration: 0.7,
        delay: 0.3,
      });

      // Links row
      gsap.from(`.${styles.linksRow}`, {
        scrollTrigger: { trigger: el, start: "top 65%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.4,
      });

      // Education
      gsap.from(`.${styles.education}`, {
        scrollTrigger: { trigger: el, start: "top 60%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.5,
      });

      // Copyright
      gsap.from(`.${styles.copyright}`, {
        scrollTrigger: { trigger: el, start: "bottom 80%", once: true },
        opacity: 0,
        duration: 0.6,
        delay: 0.6,
      });
    },
    [],
    sectionRef
  );

  return (
    <footer ref={sectionRef} className={styles.footer} id="contact">
      {/* Top marquee */}
      <div className={styles.marqueeRow}>
        <div className={styles.marquee}>
          <span>{data.marqueeText} · </span>
          <span>{data.marqueeText} · </span>
          <span>{data.marqueeText} · </span>
        </div>
      </div>

      <div className={styles.content}>
        {/* Main heading */}
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>{data.heading}</h2>
        </div>

        {/* Subtitle */}
        <p className={styles.subtitle}>{data.subtitle}</p>

        {/* CTA Button */}
        <a href={`mailto:${data.email}`} className={styles.cta}>
          {data.ctaText}
        </a>

        {/* Links row */}
        <div className={styles.linksRow}>
          <a href={`mailto:${data.email}`} className={styles.link}>
            {data.email}
          </a>
          <span className={styles.divider}>|</span>
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            LinkedIn
          </a>
          <span className={styles.divider}>|</span>
          <a href={data.resumePath} download className={styles.link}>
            Resume
          </a>
        </div>

        {/* Divider */}
        <div className={styles.dividerLine} />

        {/* Education section */}
        <div className={styles.education}>
          <div className={styles.educationBlock}>
            <p className={styles.educationText}>
              {data.education}
            </p>
          </div>
          <div className={styles.educationBlock}>
            <p className={styles.educationText}>
              {data.certifications}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <p className={styles.copyright}>{data.copyright}</p>
      </div>
    </footer>
  );
}
