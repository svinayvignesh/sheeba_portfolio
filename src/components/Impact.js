"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import ScrollVideo from "./ScrollVideo";
import styles from "./Impact.module.css";

const METRICS = [
  { value: 53, suffix: "%", label: "Faster Cycle Time", detail: "3 weeks → 14 days" },
  { value: 67, suffix: "%", label: "Faster Quarterly Close", detail: "30 days → 10 days" },
  { value: 40, suffix: "%", label: "Better Customer Response", detail: "Digital transformation at Curi" },
  { value: 50, suffix: "%", label: "Fewer AML Findings", detail: "Risk controls at US Bank" },
];

function CounterCard({ value, suffix, label, detail }) {
  const numberRef = useRef(null);

  return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        <span ref={numberRef} className={styles.number} data-target={value}>
          0{suffix}
        </span>
        <h3 className={styles.cardLabel}>{label}</h3>
        <p className={styles.cardDetail}>{detail}</p>
      </div>
    </div>
  );
}

export default function Impact() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Heading animation
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        y: 60,
      });

      gsap.from(`.${styles.subtitle}`, {
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 35%",
          scrub: 1,
        },
        opacity: 0,
        y: 40,
      });

      // Cards stagger in
      const cards = el.querySelectorAll(`.${styles.card}`);
      cards.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
          opacity: 0,
          y: 80,
          scale: 0.9,
          delay: i * 0.1,
        });
      });

      // Counter animation
      const numbers = el.querySelectorAll(`.${styles.number}`);
      numbers.forEach((num) => {
        const target = parseInt(num.dataset.target, 10);
        const suffix = num.textContent.replace(/[0-9]/g, "");

        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          once: true,
          onEnter: () => {
            gsap.to(
              { val: 0 },
              {
                val: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                  num.textContent = Math.round(this.targets()[0].val) + suffix;
                },
              }
            );
          },
        });
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.impact} id="impact">
      <ScrollVideo
        src="/videos/Futuristic_Holographic_Dashboard_Video.mp4"
        triggerRef={sectionRef}
        start="top bottom"
        end="bottom top"
        className={styles.videoBg}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h2 className={styles.heading}>Impact by the Numbers</h2>
        <p className={styles.subtitle}>
          Every transformation starts with a measurable goal — and ends with
          proof of value.
        </p>

        <div className={styles.grid}>
          {METRICS.map((metric, i) => (
            <CounterCard key={i} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
