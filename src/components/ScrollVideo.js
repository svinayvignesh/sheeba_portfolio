"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollVideo — Decoupled scroll + video with mouse parallax.
 *
 * - Video plays at normal speed when section enters viewport
 * - Fades to darker overlay as video approaches its end (no abrupt stop)
 * - When video ends, holds last frame with subtle mouse parallax for "floaty" feel
 * - Scrolling back up replays from start
 */
export default function ScrollVideo({ src, triggerRef, className = "", pinned = false }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    const trigger = triggerRef?.current;
    if (!video || !trigger || !wrapper) return;

    let rafId = null;

    // --- Mouse parallax: subtle float effect ---
    const onMouseMove = (e) => {
      const rect = trigger.getBoundingClientRect();
      // Only respond if section is in view
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const moveX = ((e.clientX - centerX) / rect.width) * 12; // max 12px
      const moveY = ((e.clientY - centerY) / rect.height) * 8; // max 8px

      gsap.to(wrapper, {
        x: moveX,
        y: moveY,
        duration: 1.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- Fade out as video approaches end ---
    const onTimeUpdate = () => {
      const remaining = video.duration - video.currentTime;
      if (remaining < 3 && video.duration > 3) {
        // Last 3 seconds: fade opacity from 1 → 0.3
        const fadeProgress = 1 - remaining / 3; // 0 → 1
        const opacity = 1 - fadeProgress * 0.7; // 1 → 0.3
        video.style.opacity = opacity;
      } else {
        video.style.opacity = 1;
      }
    };
    video.addEventListener("timeupdate", onTimeUpdate);

    // --- Hold on last frame when ended ---
    const onEnded = () => {
      video.pause();
      video.style.opacity = 0.3;
    };
    video.addEventListener("ended", onEnded);

    // --- Scroll triggers: play/pause/replay ---
    // For pinned sections, extend the end point to cover the full pinned scroll range
    const st = ScrollTrigger.create({
      trigger: trigger,
      start: "top 80%",
      end: pinned ? "max" : "bottom 20%",
      onEnter: () => {
        video.currentTime = 0;
        video.style.opacity = 1;
        video.play().catch(() => {});
      },
      onEnterBack: () => {
        video.currentTime = 0;
        video.style.opacity = 1;
        video.play().catch(() => {});
      },
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      cancelAnimationFrame(rafId);
      st.kill();
    };
  }, [src, triggerRef]);

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
        playsInline
        preload="auto"
        style={{
          width: "calc(100% + 40px)",
          height: "calc(100% + 40px)",
          objectFit: "cover",
          transition: "opacity 0.8s ease",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
