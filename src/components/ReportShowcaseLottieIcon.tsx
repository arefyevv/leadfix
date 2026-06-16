"use client";

import { useEffect, useMemo, useRef } from "react";
import Lottie from "lottie-react";
import type { LottieRefCurrentProps } from "lottie-react";
import tickAnimation from "../../public/animations/tick.json";

function stripBackground<T>(animationData: T): T {
  const cloned = structuredClone(animationData) as {
    assets?: Array<{ id?: string; layers?: Array<{ nm?: string }> }>;
  };

  cloned.assets?.forEach((asset) => {
    if (!asset.layers) return;
    asset.layers = asset.layers.filter((layer) => layer.nm !== "Shape Layer 4");
  });

  return cloned as T;
}

export function ReportShowcaseLottieIcon() {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const animationData = useMemo(() => stripBackground(tickAnimation), []);

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
    <span className="report-showcase__lottie" ref={containerRef} aria-hidden="true">
      <Lottie lottieRef={lottieRef} animationData={animationData} loop={false} autoplay={false} />
    </span>
  );
}
