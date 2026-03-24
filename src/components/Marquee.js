"use client";

import { useRef } from "react";
import styles from "./Marquee.module.css";

/**
 * Marquee: Infinite horizontal scrolling ticker.
 * Content scrolls continuously with pause on hover.
 *
 * @param {Array<string>} children - Array of text items to display
 * @param {number} speed - Animation duration in seconds (default 30)
 * @param {string} direction - 'left' or 'right' (default 'left')
 * @param {string} className - Additional container classes
 * @param {string} separator - Separator between items (default '•')
 */
export default function Marquee({
  children = [],
  speed = 30,
  direction = "left",
  className = "",
  separator = "•",
}) {
  const marqueeRef = useRef(null);

  const animationDirection = direction === "right" ? "marqueeRight" : "marqueeLeft";
  const animationStyle = {
    "--marquee-duration": `${speed}s`,
  };

  return (
    <div
      ref={marqueeRef}
      className={`${styles.marqueeContainer} ${className}`}
      style={animationStyle}
    >
      <div className={`${styles.marqueeTrack} ${styles[animationDirection]}`}>
        {/* First iteration */}
        <div className={styles.marqueeContent}>
          {children.map((item, index) => (
            <span key={`first-${index}`} className={styles.marqueeItem}>
              {item}
              {index < children.length - 1 && (
                <span className={styles.separator}>{separator}</span>
              )}
            </span>
          ))}
        </div>

        {/* Duplicate for seamless loop */}
        <div className={styles.marqueeContent} aria-hidden="true">
          {children.map((item, index) => (
            <span key={`second-${index}`} className={styles.marqueeItem}>
              {item}
              {index < children.length - 1 && (
                <span className={styles.separator}>{separator}</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
