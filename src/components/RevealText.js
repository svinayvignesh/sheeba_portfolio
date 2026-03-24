"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./RevealText.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * RevealText: Split-text reveal animation on scroll.
 * Splits text into lines based on visual layout, each line animates in with stagger.
 *
 * @param {React.ReactNode} children - Text content to animate
 * @param {string} tag - HTML tag to use (default 'h2')
 * @param {string} className - Additional classes
 * @param {number} delay - Initial delay before animation starts (default 0)
 * @param {boolean} once - Animate only once on first scroll into view (default true)
 */
export default function RevealText({
  children,
  tag: Tag = "h2",
  className = "",
  delay = 0,
  once = true,
}) {
  const containerRef = useRef(null);
  const [lineRefs, setLineRefs] = useState([]);

  // Split text into words and organize by visual lines
  useEffect(() => {
    if (!containerRef.current) return;

    const text = typeof children === "string" ? children : "";
    const words = text.split(" ");

    // Create temporary spans to measure lines
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.visibility = "hidden";
    tempContainer.style.whiteSpace = "nowrap";
    tempContainer.style.fontFamily = "var(--font-heading)";
    tempContainer.style.fontSize = window.getComputedStyle(containerRef.current).fontSize;
    document.body.appendChild(tempContainer);

    const wordSpans = words.map((word) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      tempContainer.appendChild(span);
      return span;
    });

    // Measure offsetTop of each word to determine lines
    const lines = [];
    let currentLine = [];
    let lastTop = wordSpans[0]?.offsetTop ?? 0;

    wordSpans.forEach((span, index) => {
      const currentTop = span.offsetTop;
      if (currentTop !== lastTop) {
        lines.push(currentLine);
        currentLine = [index];
        lastTop = currentTop;
      } else {
        currentLine.push(index);
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    document.body.removeChild(tempContainer);

    // Now rebuild the actual DOM with line wrappers
    containerRef.current.innerHTML = "";
    const refs = [];

    lines.forEach((lineIndices) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = styles.lineWrapper;
      lineDiv.style.overflow = "hidden";

      const contentSpan = document.createElement("span");
      contentSpan.className = styles.lineContent;

      lineIndices.forEach((wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = words[wordIndex];
        contentSpan.appendChild(wordSpan);

        if (wordIndex < words.length - 1) {
          contentSpan.appendChild(document.createTextNode(" "));
        }
      });

      lineDiv.appendChild(contentSpan);
      containerRef.current.appendChild(lineDiv);
      refs.push(lineDiv);
    });

    setLineRefs(refs);
  }, [children]);

  // Animate lines on scroll
  useEffect(() => {
    if (lineRefs.length === 0 || !containerRef.current) return;

    const ctx = gsap.context(() => {
      lineRefs.forEach((lineDiv, index) => {
        const contentSpan = lineDiv.querySelector(`.${styles.lineContent}`);

        gsap.fromTo(
          contentSpan,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
            y: "110%",
          },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            y: "0%",
            duration: 0.75,
            ease: "power3.out",
            delay: index * 0.1 + delay / 1000,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
              toggleActions: once ? "play none none none" : "play reverse play reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [lineRefs, delay, once]);

  return (
    <Tag ref={containerRef} className={`${styles.revealText} ${className}`}>
      {children}
    </Tag>
  );
}
