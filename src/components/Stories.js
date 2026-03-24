"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Stories.module.css";

const STORIES = [
  {
    id: 1,
    title: "From 3 Weeks to 14 Days",
    subtitle: "End-to-End Digital Transformation",
    challenge:
      "New business cycle time was 3 weeks. Customer response rates were lagging. Processes were manual and siloed across divisions.",
    approach: [
      "Redesigned end-to-end business processes across insurance, risk management, and wealth management",
      "Deployed AI (Co-Pilot) for customer interactions and internal workflows",
      "Integrated SaaS platforms and payment systems, eliminating data silos",
      "Implemented Salesforce CRM for 360-degree customer view",
    ],
    results: [
      { metric: "53%", label: "Faster cycle time" },
      { metric: "+40%", label: "Customer response rates" },
      { metric: "$12.3K", label: "Annual cost savings" },
      { metric: "+40%", label: "Payment processing" },
    ],
  },
  {
    id: 2,
    title: "30 Days to 10",
    subtitle: "Finance Process Revolution",
    challenge:
      "Quarterly financial close took 30 days. Multiple disconnected systems, manual reconciliation, and lack of automation created bottlenecks.",
    approach: [
      "Consolidated fragmented finance systems into unified platform",
      "Automated key processes using AI-driven workflow tools",
      "Streamlined reconciliation and reporting pipelines",
      "Trained finance teams on new automated workflows",
    ],
    results: [
      { metric: "67%", label: "Faster quarterly close" },
      { metric: "30→10", label: "Days to close" },
      { metric: "↓", label: "Manual touchpoints" },
      { metric: "↑", label: "Audit readiness" },
    ],
  },
  {
    id: 3,
    title: "Opening Doors, Closing Gaps",
    subtitle: "Financial Crimes Compliance at US Bank",
    challenge:
      "AML-related control gaps were preventing US Bank from opening new branches. KYC processes were inconsistent and teller systems had vulnerabilities.",
    approach: [
      "Evaluated teller systems and identified controls breakdowns",
      "Established comprehensive AML controls and compliance frameworks",
      "Implemented KYC workflows integrated into bank operations",
      "Led issue remediation with short-term and long-term solutions",
    ],
    results: [
      { metric: "50%", label: "Fewer AML findings" },
      { metric: "50%", label: "Better efficiency" },
      { metric: "✓", label: "Branches enabled" },
      { metric: "🏆", label: "Prestigious award" },
    ],
  },
];

export default function Stories() {
  const sectionRef = useRef(null);

  useScrollAnimation(
    (el, gsap, ScrollTrigger) => {
      // Heading entrance
      gsap.from(`.${styles.heading}`, {
        scrollTrigger: { trigger: el, start: "top 80%", once: true },
        opacity: 0,
        y: 50,
        duration: 0.8,
      });

      // Each story card: scale reveal + content fade
      const storyEls = el.querySelectorAll(`.${styles.story}`);
      storyEls.forEach((story, i) => {
        gsap.fromTo(
          story,
          {
            scale: 0.95,
            borderRadius: "12px",
          },
          {
            scrollTrigger: {
              trigger: story,
              start: "top 70%",
              end: "top 30%",
              scrub: true,
            },
            scale: 1,
            borderRadius: "0px",
            duration: 1,
          }
        );

        // Story number parallax
        gsap.from(story.querySelector(`.${styles.storyNumber}`), {
          scrollTrigger: {
            trigger: story,
            start: "top 70%",
            scrub: true,
          },
          y: 50,
          duration: 1,
        });

        // Content fade in once card enters
        gsap.from(story.querySelectorAll(`.${styles.storyContent} > *`), {
          scrollTrigger: {
            trigger: story,
            start: "top 65%",
            once: true,
          },
          opacity: 0,
          y: 20,
          stagger: 0.05,
          duration: 0.6,
          delay: 0.1,
        });
      });
    },
    [],
    sectionRef
  );

  return (
    <section ref={sectionRef} className={styles.stories} id="stories">
      <div className={styles.content}>
        <h2 className={styles.heading}>TRANSFORMATION STORIES</h2>

        <div className={styles.storyList}>
          {STORIES.map((story, i) => (
            <article key={story.id} className={styles.story}>
              <div className={styles.storyNumber}>0{i + 1}</div>

              <div className={styles.storyContent}>
                <div className={styles.storyLeft}>
                  <h3 className={styles.storyTitle}>{story.title}</h3>
                  <p className={styles.storySubtitle}>{story.subtitle}</p>

                  <div className={styles.section}>
                    <h4 className={styles.label}>THE CHALLENGE</h4>
                    <p className={styles.challengeText}>{story.challenge}</p>
                  </div>

                  <div className={styles.section}>
                    <h4 className={styles.label}>THE APPROACH</h4>
                    <ul className={styles.approachList}>
                      {story.approach.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.storyRight}>
                  <div className={styles.section}>
                    <h4 className={styles.label}>THE RESULT</h4>
                    <div className={styles.resultGrid}>
                      {story.results.map((r, j) => (
                        <div key={j} className={styles.resultItem}>
                          <span className={styles.resultMetric}>{r.metric}</span>
                          <span className={styles.resultLabel}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
