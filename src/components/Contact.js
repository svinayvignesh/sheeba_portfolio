"use client";

import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Contact.module.css";

export default function Contact() {
  const sectionRef = useScrollAnimation((el, gsap, ScrollTrigger) => {
    gsap.from(`.${styles.heading}`, {
      scrollTrigger: { trigger: el, start: "top 75%" },
      opacity: 0,
      y: 50,
      duration: 0.8,
    });

    gsap.from(`.${styles.body}`, {
      scrollTrigger: { trigger: el, start: "top 70%" },
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.15,
    });

    gsap.from(`.${styles.cta}`, {
      scrollTrigger: { trigger: el, start: "top 65%" },
      opacity: 0,
      scale: 0.9,
      duration: 0.6,
      delay: 0.3,
    });

    gsap.from(`.${styles.links}`, {
      scrollTrigger: { trigger: el, start: "top 60%" },
      opacity: 0,
      y: 20,
      duration: 0.6,
      delay: 0.45,
    });
  });

  return (
    <section ref={sectionRef} className={styles.contact} id="contact">
      <div className={styles.bgGlow} />

      <div className={styles.content}>
        <h2 className={styles.heading}>Let&apos;s Transform Together</h2>
        <p className={styles.body}>
          I partner with executives to turn strategic vision into operational
          reality. Whether it&apos;s digital transformation, M&A integration, or
          building innovation from the ground up — let&apos;s talk.
        </p>

        <a
          href="mailto:contact@sheebasukumaran.com"
          className={styles.cta}
        >
          Get in Touch →
        </a>

        <div className={styles.links}>
          <a
            href="mailto:contact@sheebasukumaran.com"
            className={styles.link}
          >
            <span className={styles.linkIcon}>📧</span>
            <span>Email</span>
          </a>
          <a
            href="https://linkedin.com/in/sheebasukumaran"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <span className={styles.linkIcon}>🔗</span>
            <span>LinkedIn</span>
          </a>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Sheeba Sukumaran. All rights reserved.
        </p>
      </div>
    </section>
  );
}
