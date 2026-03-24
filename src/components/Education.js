"use client";

import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Education.module.css";

const EDUCATION = [
  {
    degree: "Master of Science (M.Sc)",
    field: "Computer Science",
    school: "Sri Krishna University, India",
  },
  {
    degree: "Bachelor of Science (B.Sc)",
    field: "Computer Science",
    school: "Sri Krishna University, India",
  },
];

const CERTIFICATIONS = [
  { name: "AI & Digital Transformation Leader", org: "Cornell University", icon: "🤖" },
  { name: "Certified Agile Leader", org: "Scrum Alliance", icon: "⚡" },
  { name: "Certified Scrum Product Owner", org: "Scrum Alliance", icon: "📋" },
  { name: "Lean Six Sigma Green Belt", org: "UNC Charlotte", icon: "📊" },
  { name: "Anti-Money Laundering (AMLC)", org: "ACAMS", icon: "🔒" },
];

export default function Education() {
  const sectionRef = useScrollAnimation((el, gsap, ScrollTrigger) => {
    gsap.from(`.${styles.heading}`, {
      scrollTrigger: { trigger: el, start: "top 80%" },
      opacity: 0,
      y: 50,
      duration: 0.8,
    });

    const cards = el.querySelectorAll(`.${styles.eduCard}`);
    gsap.from(cards, {
      scrollTrigger: { trigger: el, start: "top 70%" },
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
    });

    const badges = el.querySelectorAll(`.${styles.certBadge}`);
    gsap.from(badges, {
      scrollTrigger: { trigger: `.${styles.certGrid}`, start: "top 80%" },
      opacity: 0,
      scale: 0.8,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
    });
  });

  return (
    <section ref={sectionRef} className={styles.education} id="education">
      <div className={styles.content}>
        <h2 className={styles.heading}>Education & Credentials</h2>

        <div className={styles.eduRow}>
          {EDUCATION.map((edu, i) => (
            <div key={i} className={styles.eduCard}>
              <h3 className={styles.degree}>{edu.degree}</h3>
              <p className={styles.field}>{edu.field}</p>
              <p className={styles.school}>{edu.school}</p>
            </div>
          ))}
        </div>

        <h3 className={styles.certHeading}>Professional Certifications</h3>

        <div className={styles.certGrid}>
          {CERTIFICATIONS.map((cert, i) => (
            <div key={i} className={styles.certBadge}>
              <span className={styles.certIcon}>{cert.icon}</span>
              <div>
                <h4 className={styles.certName}>{cert.name}</h4>
                <p className={styles.certOrg}>{cert.org}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
