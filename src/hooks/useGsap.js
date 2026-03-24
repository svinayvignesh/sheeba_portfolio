"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP ScrollTrigger animations.
 * The setup callback receives (el, gsap, ScrollTrigger).
 *
 * @param {Function} setup - animation setup function
 * @param {Array} deps - dependency array
 * @param {React.RefObject} [externalRef] - optional external ref to use instead of creating one
 * @returns {React.RefObject} - ref to attach to the container
 */
export function useScrollAnimation(setup, deps = [], externalRef = null) {
  const internalRef = useRef(null);
  const containerRef = externalRef || internalRef;

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      setup(containerRef.current, gsap, ScrollTrigger);
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return containerRef;
}

export { gsap, ScrollTrigger };
