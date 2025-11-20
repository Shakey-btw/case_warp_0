"use client";

import * as React from "react";

interface AnimatedNumberProps {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({ value, formatter, className }: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = React.useState(value);
  const [isAnimating, setIsAnimating] = React.useState(false);
  const previousValueRef = React.useRef(value);
  const animationFrameRef = React.useRef<number | null>(null);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      previousValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    if (value !== previousValueRef.current) {
      setIsAnimating(true);
      const startValue = previousValueRef.current;
      const endValue = value;
      const delay = 150; // 150ms delay before animation starts
      const duration = 1200; // 1200ms animation for smoother effect
      const startTime = Date.now() + delay;

      const animate = () => {
        const currentTime = Date.now();
        if (currentTime < startTime) {
          // Still in delay period
          animationFrameRef.current = requestAnimationFrame(animate);
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing function (ease-out-cubic with slight ease-in)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        // Add a slight ease-in at the beginning for extra smoothness
        const smoothEase = progress < 0.2 
          ? progress * 5 * 0.2 // Gentle start
          : 0.2 + (easeOutCubic - 0.2) * (1 / 0.8); // Smooth continuation
        
        const currentValue = startValue + (endValue - startValue) * smoothEase;
        setDisplayValue(currentValue);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(endValue);
          setIsAnimating(false);
          previousValueRef.current = endValue;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value]);

  const formattedValue = formatter 
    ? formatter(displayValue)
    : displayValue.toLocaleString('en-US', { maximumFractionDigits: 0 });

  return (
    <span 
      className={className}
      style={{
        transition: isAnimating ? 'none' : 'opacity 0.2s',
      }}
    >
      {formattedValue}
    </span>
  );
}

