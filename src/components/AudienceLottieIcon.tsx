"use client";

import { useEffect, useMemo, useRef } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import analyticsAnimation from "../../public/animations/analytics.json";
import businessAnimation from "../../public/animations/business.json";
import designAnimation from "../../public/animations/design.json";
import marketingAnimation from "../../public/animations/marketing.json";

const animations = {
  analytics: analyticsAnimation,
  business: businessAnimation,
  design: designAnimation,
  marketing: marketingAnimation
};

type AudienceLottieIconProps = {
  name: keyof typeof animations;
};

function thickenStrokes<T>(animationData: T): T {
  const cloned = structuredClone(animationData) as Record<string, unknown>;

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;

    const record = node as Record<string, unknown>;
    const width = record.w as { k?: unknown } | undefined;

    if (record.ty === "st" && width && typeof width.k === "number") {
      width.k = Math.max(width.k * 1.45, width.k + 0.7);
    }

    Object.values(record).forEach((value) => {
      if (Array.isArray(value)) {
        value.forEach(walk);
      } else {
        walk(value);
      }
    });
  }

  walk(cloned);
  return cloned as T;
}

export function AudienceLottieIcon({ name }: AudienceLottieIconProps) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const animationData = useMemo(() => thickenStrokes(animations[name]), [name]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    let canReplay = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        if (entry.isIntersecting && canReplay) {
          canReplay = false;
          lottieRef.current?.stop();
          lottieRef.current?.play();
          return;
        }

        if (!entry.isIntersecting) {
          canReplay = true;
          lottieRef.current?.stop();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <span className="audience-lottie" ref={containerRef} aria-hidden="true">
      <Lottie lottieRef={lottieRef} animationData={animationData} loop={false} autoplay={false} />
    </span>
  );
}
