"use client";

import { useEffect, useRef } from "react";
import styles from "./FloatingElements.module.css";

/**
 * FloatingElements — 2D decorative shapes that respond to mouse movement.
 * Creates depth and character with gentle parallax motion.
 */
export default function FloatingElements() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll(`.${styles.el}`);

    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 to 1
      const dy = (e.clientY - cy) / cy; // -1 to 1

      elements.forEach((el) => {
        const speed = parseFloat(el.dataset.speed || 1);
        const x = dx * speed * 30;
        const y = dy * speed * 20;
        const rotate = dx * speed * 5;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      {/* Circles */}
      <div className={`${styles.el} ${styles.circle}`} data-speed="0.5"
           style={{ top: "8%", left: "5%" }} />
      <div className={`${styles.el} ${styles.circleSm}`} data-speed="1.2"
           style={{ top: "25%", right: "8%" }} />
      <div className={`${styles.el} ${styles.circle}`} data-speed="0.8"
           style={{ bottom: "15%", right: "12%" }} />

      {/* Diamonds */}
      <div className={`${styles.el} ${styles.diamond}`} data-speed="1.0"
           style={{ top: "45%", left: "3%" }} />
      <div className={`${styles.el} ${styles.diamondSm}`} data-speed="1.5"
           style={{ top: "65%", right: "5%" }} />

      {/* Lines */}
      <div className={`${styles.el} ${styles.line}`} data-speed="0.6"
           style={{ top: "18%", left: "50%" }} />
      <div className={`${styles.el} ${styles.lineV}`} data-speed="0.9"
           style={{ bottom: "30%", left: "15%" }} />

      {/* Dots */}
      <div className={`${styles.el} ${styles.dot}`} data-speed="2.0"
           style={{ top: "35%", left: "25%" }} />
      <div className={`${styles.el} ${styles.dot}`} data-speed="1.8"
           style={{ bottom: "20%", left: "40%" }} />
      <div className={`${styles.el} ${styles.dot}`} data-speed="1.3"
           style={{ top: "55%", right: "25%" }} />

      {/* Cross */}
      <div className={`${styles.el} ${styles.cross}`} data-speed="0.7"
           style={{ bottom: "10%", left: "55%" }} />
      <div className={`${styles.el} ${styles.cross}`} data-speed="1.1"
           style={{ top: "12%", right: "30%" }} />
    </div>
  );
}
