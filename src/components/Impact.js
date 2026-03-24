"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Impact.module.css";

const METRICS = [
  { value: 53, suffix: "%", label: "Faster Cycle Time", detail: "3 weeks → 14 days" },
  { value: 67, suffix: "%", label: "Faster Quarterly Close", detail: "30 days → 10 days" },
  { value: 40, suffix: "%", label: "Better Customer Response", detail: "Digital transformation at Curi" },
  { value: 50, suffix: "%", label: "Fewer AML Findings", detail: "Risk controls at US Bank" },
];

function MetricCard({ value, suffix, label, detail }) {
  const numberRef = useRef(null);

  return (
    <div className={styles.metric}>
      <span ref={numberRef} className={styles.number} data-target={value}>
        0{suffix}
      </span>
      <h3 className={styles.label}>{label}</h3>
      <p className={styles.detail}>{detail}</p>
    </div>
  );
}

export default function Impact() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const headingTextRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Heading clip-path reveal animation
      gsap.from(headingTextRef.current, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          once: true,
        },
        yPercent: 100,
        duration: 0.8,
        ease: "power3.out",
      });

      // Subtitle fade up
      gsap.from(`.${styles.subtitle}`, {
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          once: true,
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: "power3.out",
      });

      // Metrics fade up with stagger
      const metrics = el.querySelectorAll(`.${styles.metric}`);
      metrics.forEach((metric, i) => {
        gsap.from(metric, {
          scrollTrigger: {
            trigger: el,
            start: "top 60%",
            once: true,
          },
          opacity: 0,
          y: 40,
          duration: 0.8,
          delay: i * 0.15,
          ease: "power3.out",
        });
      });

      // Counter animations
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
      <div className={styles.content}>
        <div ref={headingRef} className={styles.headingWrapper}>
          <h2 ref={headingTextRef} className={styles.heading}>
            IMPACT BY THE NUMBERS
          </h2>
        </div>

        <p className={styles.subtitle}>
          Every transformation starts with a measurable goal — and ends with
          proof of value.
        </p>

        <div className={styles.grid}>
          {METRICS.map((metric, i) => (
            <MetricCard key={i} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
