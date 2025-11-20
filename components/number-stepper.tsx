"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function NumberStepper({ 
  value, 
  onChange, 
  min = 0, 
  max = Infinity,
  className 
}: NumberStepperProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDecrement}
        disabled={value <= min}
        className="h-8 w-8 p-0"
      >
        −
      </Button>
      <span className="text-body text-text-primary min-w-[2rem] text-center">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleIncrement}
        disabled={value >= max}
        className="h-8 w-8 p-0"
      >
        +
      </Button>
    </div>
  );
}

