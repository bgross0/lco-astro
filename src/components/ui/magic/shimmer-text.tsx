import { cn } from "@/lib/utils";
import React from "react";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerColor?: string;
}

const ShimmerText: React.FC<ShimmerTextProps> = ({
  children,
  className,
  shimmerColor = "#ffffff",
}) => {
  return (
    <p
      style={
        {
          "--shimmer-color": shimmerColor,
        } as React.CSSProperties
      }
      className={cn(
        "mx-auto max-w-md text-neutral-600/70 dark:text-neutral-400/70",
        "animate-shimmer bg-clip-text bg-no-repeat [background-position:0_0] [background-size:var(--shimmer-width)_100%] [transition:background-position_1s_cubic-bezier(.6,.6,0,1)_infinite]",
        "bg-gradient-to-r from-transparent via-black/80 via-50% to-transparent dark:via-white/80",
        className
      )}
    >
      {children}
    </p>
  );
};

export { ShimmerText };