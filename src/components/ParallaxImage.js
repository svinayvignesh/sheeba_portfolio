"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./ParallaxImage.module.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxImage: Scroll-driven parallax effect for images.
 * Image moves within overflow-hidden container based on scroll progress.
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {number} speed - Parallax speed multiplier (default 0.3)
 * @param {string} className - Additional container classes
 * @param {React.CSSProperties} style - Additional inline styles
 * @param {boolean} fill - Use Next.js Image fill mode (default true)
 * @param {number} width - Image width if not using fill
 * @param {number} height - Image height if not using fill
 */
export default function ParallaxImage({
  src,
  alt,
  speed = 0.3,
  className = "",
  style = {},
  fill = true,
  width,
  height,
}) {
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !imageRef.current) return;

    const ctx = gsap.context(() => {
      // Scale image to allow room for parallax movement
      const scale = 1 + speed;

      gsap.set(imageRef.current, {
        scale: scale,
      });

      // Create parallax animation with scrollTrigger
      gsap.to(imageRef.current, {
        y: `${speed * 100}px`,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: false,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`${styles.parallaxContainer} ${className}`}
      style={style}
    >
      {fill ? (
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className={styles.parallaxImage}
          priority={false}
        />
      ) : (
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={styles.parallaxImage}
          priority={false}
        />
      )}
    </div>
  );
}
