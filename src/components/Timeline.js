"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Timeline.module.css";

const ROLES = [
  {
    period: "2003–2012",
    shortPeriod: "03–12",
    title: "Foundations in Tech & Product",
    role: "Analyst/Developer → HRIS Analyst → Product Analyst",
    description:
      "Built product specs, SQL reporting frameworks, and a digital rewards module from scratch. Established foundation in data, analytics, and stakeholder management.",
    companies: "Towers Watson · Family Health · CMTES",
    tags: ["SQL", "Product", "HR Tech"],
  },
  {
    period: "2012–2016",
    shortPeriod: "12–16",
    title: "Scaling Enterprise Systems",
    role: "Senior Business Analyst & Project Manager",
    description:
      "Implemented workforce management, talent management, and loss prevention systems across Belk's enterprise. Automated timecard processing and reduced HR errors by 15%.",
    companies: "Belk",
    tags: ["Workforce Mgmt", "Integration", "HR"],
  },
  {
    period: "2017–2021",
    shortPeriod: "17–21",
    title: "Risk, Compliance & Controls",
    role: "VP – Risk & Process Control Manager",
    description:
      "Managed AML compliance controls enabling branch expansion. Reduced compliance gaps by 40% and AML findings by 50%. Standardized project governance.",
    companies: "US Bank",
    tags: ["AML", "KYC", "Compliance"],
  },
  {
    period: "2021–2022",
    shortPeriod: "21–22",
    title: "Building from the Ground Up",
    role: "Director, Business Process Innovation",
    description:
      "Built the Operations Excellence team and PMO from scratch. Introduced digital payments, reduced call volumes by 30%, and established innovation governance.",
    companies: "Curi",
    tags: ["PMO", "Innovation", "CRM"],
  },
  {
    period: "2022–Present",
    shortPeriod: "22–26",
    title: "Enterprise Transformation at Scale",
    role: "Director, Business Transformation — Data & Tech",
    description:
      "Leading digital transformation across three business units. Reduced cycle time by 53%, quarterly close by 67%, and drove AI automation, SaaS integration, and CRM transformation.",
    companies: "Curi",
    tags: ["AI", "M&A", "Salesforce", "Finance"],
    current: true,
  },
];

export default function Timeline() {
  const sectionRef = useRef(null);
  const progressLineRef = useRef(null);

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
      cards.forEach((card, i) => {
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

      // Progress line scrub with scroll
      gsap.to(progressLineRef.current, {
        scaleY: 1,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.timeline} id="timeline">
      <div className={styles.header}>
        <h2 className={styles.heading}>CAREER JOURNEY</h2>
        <p className={styles.headingSub}>20+ years of progressive leadership</p>
      </div>

      <div className={styles.container}>
        <div className={styles.stickyColumn}>
          <div className={styles.stickyContent}>
            <div className={styles.periodDisplay}>
              {ROLES[ROLES.length - 1].shortPeriod}
            </div>
            <div ref={progressLineRef} className={styles.progressLine} />
          </div>
        </div>

        <div className={styles.cardsColumn}>
          {ROLES.map((roleData, i) => (
            <div
              key={i}
              className={`${styles.card} ${roleData.current ? styles.cardCurrent : ""}`}
            >
              <span className={styles.periodLabel}>{roleData.period}</span>
              <h3 className={styles.cardTitle}>{roleData.title}</h3>
              <p className={styles.cardRole}>{roleData.role}</p>
              <p className={styles.cardDesc}>{roleData.description}</p>
              <p className={styles.cardCompany}>{roleData.companies}</p>
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
