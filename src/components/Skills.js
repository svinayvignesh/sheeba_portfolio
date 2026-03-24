"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Skills.module.css";

const MARQUEE_ROWS = [
  {
    direction: "ltr",
    duration: 25,
    items: [
      "Digital Transformation",
      "M&A Integration",
      "Innovation Strategy",
      "Change Management",
      "Operational Excellence",
      "Business Process Reengineering",
      "Stakeholder Management",
      "Strategic Roadmapping",
    ],
  },
  {
    direction: "rtl",
    duration: 32,
    items: [
      "AI/ML (Co-Pilot)",
      "Salesforce",
      "HubSpot",
      "Agiloft",
      "SaaS Integration",
      "Payment Platforms",
      "CRM / CPQ",
      "KPI Dashboards",
    ],
  },
  {
    direction: "ltr",
    duration: 22,
    items: [
      "Agile Product Delivery",
      "Lean Six Sigma",
      "Scrum",
      "Portfolio Management",
      "PMO Governance",
      "Product Ownership",
    ],
  },
  {
    direction: "rtl",
    duration: 28,
    items: [
      "Anti-Money Laundering",
      "KYC Workflows",
      "Financial Crimes Compliance",
      "Risk Assessment",
      "Controls Framework",
      "Issue Remediation",
    ],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap) => {
      // Heading entrance
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });

      // Each row fades in with stagger
      const rows = el.querySelectorAll(`.${styles.row}`);
      gsap.from(rows, {
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.skills} id="skills">
      <div className={styles.content}>
        <h2 className={styles.heading}>EXPERTISE</h2>

        <div className={styles.marqueeContainer}>
          {MARQUEE_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className={styles.row}
              style={{
                "--duration": `${row.duration}s`,
                "--direction": row.direction === "ltr" ? "0%" : "-50%",
                "--direction-end": row.direction === "ltr" ? "-50%" : "0%",
              }}
            >
              <div className={styles.marquee}>
                <div className={styles.marqueeContent}>
                  {row.items.map((item, i) => (
                    <span key={i} className={styles.item}>
                      {item}
                    </span>
                  ))}
                </div>
                <div className={styles.marqueeContent} aria-hidden="true">
                  {row.items.map((item, i) => (
                    <span key={i} className={styles.item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
