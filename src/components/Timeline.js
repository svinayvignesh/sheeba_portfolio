"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import ScrollVideo from "./ScrollVideo";
import styles from "./Timeline.module.css";

const ROLES = [
  {
    period: "2003–2012",
    title: "Foundations in Tech & Product",
    roles: "Analyst/Developer → HRIS Analyst → Product Analyst",
    description:
      "Built product specs, SQL reporting frameworks, and a digital rewards module from scratch. Established foundation in data, analytics, and stakeholder management.",
    companies: "Towers Watson · Family Health · CMTES",
    tags: ["SQL", "Product", "HR Tech"],
  },
  {
    period: "2012–2016",
    title: "Scaling Enterprise Systems",
    roles: "Senior Business Analyst & Project Manager",
    description:
      "Implemented workforce management, talent management, and loss prevention systems across Belk's enterprise. Automated timecard processing and reduced HR errors by 15%.",
    companies: "Belk",
    tags: ["Workforce Mgmt", "Integration", "HR"],
  },
  {
    period: "2017–2021",
    title: "Risk, Compliance & Controls",
    roles: "VP – Risk & Process Control Manager",
    description:
      "Managed AML compliance controls enabling branch expansion. Reduced compliance gaps by 40% and AML findings by 50%. Standardized project governance.",
    companies: "US Bank",
    tags: ["AML", "KYC", "Compliance"],
  },
  {
    period: "2021–2022",
    title: "Building from the Ground Up",
    roles: "Director, Business Process Innovation",
    description:
      "Built the Operations Excellence team and PMO from scratch. Introduced digital payments, reduced call volumes by 30%, and established innovation governance.",
    companies: "Curi",
    tags: ["PMO", "Innovation", "CRM"],
  },
  {
    period: "2022–Present",
    title: "Enterprise Transformation at Scale",
    roles: "Director, Business Transformation — Data & Tech",
    description:
      "Leading digital transformation across three business units. Reduced cycle time by 53%, quarterly close by 67%, and drove AI automation, SaaS integration, and CRM transformation.",
    companies: "Curi",
    tags: ["AI", "M&A", "Salesforce", "Finance"],
    current: true,
  },
];

export default function Timeline() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      const track = el.querySelector(`.${styles.track}`);

      // Heading fade in
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
      });

      // Horizontal scroll
      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate the progress line
      gsap.from(`.${styles.progressLine}`, {
        scaleX: 0,
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${totalScroll}`,
          scrub: 1,
        },
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.timeline} id="timeline">
      <ScrollVideo
        src="/videos/City_Skyline_Career_Growth_Timelapse.mp4"
        triggerRef={sectionRef}
        className={styles.videoBg}
        pinned
      />
      <div className={styles.overlay} />

      <div className={styles.headerRow}>
        <h2 className={styles.heading}>Career Journey</h2>
        <p className={styles.headingSub}>20+ years of progressive leadership</p>
      </div>

      <div className={styles.trackWrapper}>
        <div className={styles.progressLine} />
        <div className={styles.track}>
          {ROLES.map((role, i) => (
            <div
              key={i}
              className={`${styles.card} ${role.current ? styles.cardCurrent : ""}`}
            >
              <span className={styles.period}>{role.period}</span>
              <div className={styles.dot}>
                <div className={styles.dotInner} />
              </div>
              <h3 className={styles.cardTitle}>{role.title}</h3>
              <p className={styles.cardRole}>{role.roles}</p>
              <p className={styles.cardDesc}>{role.description}</p>
              <p className={styles.cardCompany}>{role.companies}</p>
              <div className={styles.tagRow}>
                {role.tags.map((tag, j) => (
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
