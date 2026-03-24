"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollVideo — Immersive video background with mouse parallax.
 *
 * - Plays at normal speed, loops when it ends
 * - Fades out briefly at loop boundary for seamless transition
 * - Subtle mouse parallax for "floaty" feel
 * - Scroll-triggered: plays when section is in view, pauses when out
 * - Scrolling back up restarts the video
 */
export default function ScrollVideo({ src, triggerRef, className = "", pinned = false }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    const trigger = triggerRef?.current;
    if (!video || !trigger || !wrapper) return;

    // --- Mouse parallax: subtle float effect ---
    const onMouseMove = (e) => {
      const rect = trigger.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = ((e.clientX - centerX) / rect.width) * 15;
      const moveY = ((e.clientY - centerY) / rect.height) * 10;

      gsap.to(wrapper, {
        x: moveX,
        y: moveY,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- Scroll triggers: play/pause ---
    const st = ScrollTrigger.create({
      trigger: trigger,
      start: "top 80%",
      end: pinned ? "max" : "bottom 20%",
      onEnter: () => {
        video.play().catch(() => {});
      },
      onEnterBack: () => {
        video.currentTime = 0;
        video.play().catch(() => {});
      },
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      st.kill();
    };
  }, [src, triggerRef, pinned]);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "absolute",
        inset: "-20px",
        overflow: "hidden",
        willChange: "transform",
      }}
    >
      <video
        ref={videoRef}
        className={className}
        muted
        loop
        playsInline
        preload="auto"
        style={{
          width: "calc(100% + 40px)",
          height: "calc(100% + 40px)",
          objectFit: "cover",
          filter: "saturate(1.4) brightness(1.15) contrast(1.05)",
          transition: "opacity 0.8s ease",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
