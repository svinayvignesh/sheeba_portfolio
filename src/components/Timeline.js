"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Timeline.module.css";

export default function Timeline({ data }) {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Heading fade up
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      // Cards fade up with stagger
      const cards = el.querySelectorAll(`.${styles.card}`);
      cards.forEach((card) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
        });
      });

      // Progress line scrubs full height
      if (lineRef.current) {
        gsap.to(lineRef.current, {
          scaleY: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        });
      }
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.timeline} id="timeline">
      <div className={styles.header}>
        <h2 className={styles.heading}>{data.heading}</h2>
        <p className={styles.headingSub}>{data.subtitle}</p>
      </div>

      <div className={styles.container}>
        {/* Vertical progress line — runs full height */}
        <div className={styles.lineTrack}>
          <div ref={lineRef} className={styles.lineFill} />
        </div>

        {/* Cards */}
        <div className={styles.cardsColumn}>
          {data.roles.map((roleData, i) => (
            <div
              key={i}
              className={`${styles.card} ${roleData.current ? styles.cardCurrent : ""}`}
            >
              {/* Year badge */}
              <div className={styles.yearBadge}>
                <span className={styles.yearDot} />
                <span className={styles.yearText}>{roleData.period}</span>
              </div>

              {/* Phase title */}
              <h3 className={styles.cardTitle}>{roleData.title}</h3>

              {/* Company/role blocks — prominent */}
              <div className={styles.rolesBlock}>
                {roleData.roles.map((r, j) => (
                  <div key={j} className={styles.roleRow}>
                    <div className={styles.logoWrapper}>
                      <span className={styles.logoInitial}>{r.initial}</span>
                    </div>
                    <div className={styles.roleInfo}>
                      <span className={styles.roleName}>{r.role}</span>
                      <span className={styles.companyName}>{r.company}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className={styles.cardDesc}>{roleData.description}</p>

              {/* Tags */}
              <div className={styles.tagRow}>
                {roleData.tags.map((tag, j) => (
                  <span key={j} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
