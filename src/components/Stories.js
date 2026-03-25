"use client";

import { useRef } from "react";
import { useScrollAnimation } from "@/hooks/useGsap";
import styles from "./Stories.module.css";

export default function Stories({ data }) {
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
        <h2 className={styles.heading}>{data.heading}</h2>

        <div className={styles.storyList}>
          {data.items.map((story, i) => (
            <article key={i} className={styles.story}>
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
