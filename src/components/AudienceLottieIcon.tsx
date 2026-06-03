"use client";

import Lottie from "lottie-react";
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

export function AudienceLottieIcon({ name }: AudienceLottieIconProps) {
  return (
    <span className="audience-lottie" aria-hidden="true">
      <Lottie animationData={animations[name]} loop autoplay />
    </span>
  );
}
