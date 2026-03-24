"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import ScrollVideo from "./ScrollVideo";
import styles from "./Skills.module.css";

const SKILL_GROUPS = [
  {
    title: "Strategic Leadership",
    skills: [
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
    title: "Technology & Tools",
    skills: [
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
    title: "Methodologies",
    skills: [
      "Agile Product Delivery",
      "Lean Six Sigma",
      "Scrum",
      "Portfolio Management",
      "PMO Governance",
      "Product Ownership",
    ],
  },
  {
    title: "Compliance & Risk",
    skills: [
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
      // Heading — simple entrance
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });

      // Each group card enters
      const groups = el.querySelectorAll(`.${styles.group}`);
      groups.forEach((group, i) => {
        gsap.from(group, {
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: i * 0.08,
        });
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.skills} id="skills">
      <ScrollVideo
        src="/videos/Neural_Network_Visualization_Video_Generation.mp4"
        triggerRef={sectionRef}
        className={styles.videoBg}
      />
      <div className={styles.overlay} />

      <div className={styles.content}>
        <h2 className={styles.heading}>Skills &amp; Expertise</h2>

        <div className={styles.grid}>
          {SKILL_GROUPS.map((group, i) => (
            <div key={i} className={styles.group}>
              <h3 className={styles.groupTitle}>{group.title}</h3>
              <div className={styles.tagList}>
                {group.skills.map((skill, j) => (
                  <span key={j} className={styles.tag}>
                    {skill}
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
