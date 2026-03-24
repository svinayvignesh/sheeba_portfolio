"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Timeline.module.css";

const ROLES = [
  {
    period: "2003–2012",
    title: "Foundations in Tech & Product",
    roles: [
      { role: "Product Analyst", company: "Towers Watson", initial: "TW" },
      { role: "HRIS Analyst", company: "Family Health Center", initial: "FH" },
      { role: "Analyst / Developer", company: "CMTES Informatics", initial: "CI" },
    ],
    description:
      "Built product specs, SQL reporting frameworks, and a digital rewards module from scratch. Reduced report generation time 25% and manual HR processes by 30%.",
    tags: ["SQL", "Product", "HR Tech", "LMS"],
  },
  {
    period: "2012–2016",
    title: "Scaling Enterprise Systems",
    roles: [
      { role: "Sr. Business Analyst & Project Manager", company: "Belk", initial: "B" },
    ],
    description:
      "Implemented workforce management, talent management, and loss prevention systems across the enterprise. Automated timecard processing and reduced HR errors by 15%.",
    tags: ["Workforce Mgmt", "Integration", "HR"],
  },
  {
    period: "2017–2021",
    title: "Risk, Compliance & Controls",
    roles: [
      { role: "VP — Risk & Process Control Manager", company: "US Bank", initial: "USB" },
    ],
    description:
      "Managed AML compliance and process controls enabling branch expansion. Reduced compliance gaps by 40% and AML findings by 50%. Led transformational initiatives.",
    tags: ["AML", "KYC", "Compliance", "Risk"],
  },
  {
    period: "2021–2022",
    title: "Building from the Ground Up",
    roles: [
      { role: "Director, Business Process Innovation", company: "Curi", initial: "C" },
    ],
    description:
      "Built Operations Excellence team and PMO from scratch. Introduced digital payments, reduced call volumes by 30%, and established innovation governance.",
    tags: ["PMO", "Innovation", "CRM", "Product"],
  },
  {
    period: "2022–Present",
    title: "Enterprise Transformation at Scale",
    roles: [
      { role: "Director, Business Transformation", company: "Curi", initial: "C" },
    ],
    description:
      "Leading digital transformation across three business units. Reduced cycle time by 53%, quarterly close by 67%, and drove AI automation, SaaS integration, and CRM transformation.",
    tags: ["AI", "M&A", "Salesforce", "Finance"],
    current: true,
  },
];

export default function Timeline() {
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
        <h2 className={styles.heading}>CAREER JOURNEY</h2>
        <p className={styles.headingSub}>20+ years of progressive leadership</p>
      </div>

      <div className={styles.container}>
        {/* Vertical progress line — runs full height */}
        <div className={styles.lineTrack}>
          <div ref={lineRef} className={styles.lineFill} />
        </div>

        {/* Cards */}
        <div className={styles.cardsColumn}>
          {ROLES.map((roleData, i) => (
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
