"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1.2,
  cooldownTime = 2.5,
  className,
  textClassName,
}: GooeyTextProps) {
  const filterId = useId();
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const morphRef = useRef(0);
  const cooldownRef = useRef(cooldownTime);
  const timeRef = useRef(0);
  const textIndexRef = useRef(0);

  const setMorph = (fraction: number) => {
    if (!text1Ref.current || !text2Ref.current) return;
    const blur2 = Math.min(8 / fraction - 8, 100);
    text2Ref.current.style.filter = `blur(${blur2}px)`;
    text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
    const f = 1 - fraction;
    const blur1 = Math.min(8 / f - 8, 100);
    text1Ref.current.style.filter = `blur(${blur1}px)`;
    text1Ref.current.style.opacity = `${Math.pow(f, 0.4) * 100}%`;
  };

  const doCooldown = () => {
    morphRef.current = 0;
    if (text2Ref.current) {
      text2Ref.current.style.filter = "";
      text2Ref.current.style.opacity = "100%";
    }
    if (text1Ref.current) {
      text1Ref.current.style.filter = "";
      text1Ref.current.style.opacity = "0%";
    }
  };

  useEffect(() => {
    if (!text1Ref.current || !text2Ref.current) return;
    timeRef.current = Date.now();
    text1Ref.current.textContent = texts[0];
    text2Ref.current.textContent = texts[1 % texts.length];
    text1Ref.current.style.opacity = "100%";
    text2Ref.current.style.opacity = "0%";

    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = Date.now();
      const dt = (now - timeRef.current) / 1000;
      timeRef.current = now;

      cooldownRef.current -= dt;

      if (cooldownRef.current <= 0) {
        if (morphRef.current === 0) {
          textIndexRef.current = (textIndexRef.current + 1) % texts.length;
          const prev = (textIndexRef.current - 1 + texts.length) % texts.length;
          if (text1Ref.current) text1Ref.current.textContent = texts[prev];
          if (text2Ref.current) text2Ref.current.textContent = texts[textIndexRef.current];
        }
        morphRef.current += dt;
        if (morphRef.current >= morphTime) {
          cooldownRef.current = cooldownTime;
          morphRef.current = 0;
          const next = (textIndexRef.current + 1) % texts.length;
          if (text1Ref.current) text1Ref.current.textContent = texts[textIndexRef.current];
          if (text2Ref.current) text2Ref.current.textContent = texts[next];
          doCooldown();
        } else {
          setMorph(morphRef.current / morphTime);
        }
      } else {
        doCooldown();
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative", className)}>
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
      <div style={{ filter: `url(#${filterId})`, position: "relative" }}>
        <span
          ref={text1Ref}
          aria-hidden="true"
          className={cn("block select-none", textClassName)}
        />
        <span
          ref={text2Ref}
          className={cn("block select-none absolute inset-0", textClassName)}
        />
      </div>
    </div>
  );
}
