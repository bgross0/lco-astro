"use client";
import React from "react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute h-full w-full"
      >
        <path
          d="M0 128L34.8 117.3C69.6 106.7 139.2 85.3 208.8 90.7C278.4 96 348 128 417.6 133.3C487.2 138.7 556.8 117.3 626.4 122.7C696 128 765.6 160 835.2 170.7C904.8 181.3 974.4 170.7 1044 144C1113.6 117.3 1183.2 74.7 1252.8 69.3C1322.4 64 1392 96 1426.8 112L1461.6 128"
          stroke="url(#paint0_linear_10_2)"
          strokeOpacity="0.4"
          strokeWidth="0.5"
        />
        <path
          d="M0 64L34.8 53.3C69.6 42.7 139.2 21.3 208.8 26.7C278.4 32 348 64 417.6 69.3C487.2 74.7 556.8 53.3 626.4 58.7C696 64 765.6 96 835.2 106.7C904.8 117.3 974.4 106.7 1044 80C1113.6 53.3 1183.2 10.7 1252.8 5.3C1322.4 0 1392 32 1426.8 48L1461.6 64"
          stroke="url(#paint1_linear_10_2)"
          strokeOpacity="0.4"
          strokeWidth="0.5"
        />
        <path
          d="M0 192L34.8 181.3C69.6 170.7 139.2 149.3 208.8 154.7C278.4 160 348 192 417.6 197.3C487.2 202.7 556.8 181.3 626.4 186.7C696 192 765.6 224 835.2 234.7C904.8 245.3 974.4 234.7 1044 208C1113.6 181.3 1183.2 138.7 1252.8 133.3C1322.4 128 1392 160 1426.8 176L1461.6 192"
          stroke="url(#paint2_linear_10_2)"
          strokeOpacity="0.4"
          strokeWidth="0.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear_10_2"
            x1="0"
            y1="128"
            x2="1461.6"
            y2="128"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#18CCFC" stopOpacity="0" />
            <stop offset="0.5" stopColor="#18CCFC" />
            <stop offset="1" stopColor="#18CCFC" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_10_2"
            x1="0"
            y1="64"
            x2="1461.6"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#6344F5" stopOpacity="0" />
            <stop offset="0.5" stopColor="#6344F5" />
            <stop offset="1" stopColor="#6344F5" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_10_2"
            x1="0"
            y1="192"
            x2="1461.6"
            y2="192"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#AE48FF" stopOpacity="0" />
            <stop offset="0.5" stopColor="#AE48FF" />
            <stop offset="1" stopColor="#AE48FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

import { cn } from "@/lib/utils";