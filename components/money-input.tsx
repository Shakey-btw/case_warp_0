"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends Omit<React.ComponentProps<"input">, "value" | "onChange"> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  label?: string;
}

/**
 * Money input component that formats currency values
 * Accepts input like "3.4" or "3,400,000" and converts to number
 */
export function MoneyInput({ 
  value, 
  onChange, 
  label,
  className,
  ...props 
}: MoneyInputProps) {
  const [displayValue, setDisplayValue] = React.useState<string>("");

  // Format number for display (e.g., 3400000 -> "3.400.000")
  const formatForDisplay = (num: number | undefined): string => {
    if (num === undefined || num === 0) return "";
    return num.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).replace(/,/g, '.');
  };

  // Parse input string to number (only numbers and decimal point allowed)
  const parseInput = (input: string): number | undefined => {
    if (!input || input.trim() === "") return undefined;
    
    // Remove all non-digit characters except decimal point
    const cleaned = input.replace(/[^\d.]/g, "");
    
    if (cleaned === "" || cleaned === ".") return undefined;
    
    // Prevent multiple decimal points
    const parts = cleaned.split(".");
    const sanitized = parts.length > 2 
      ? parts[0] + "." + parts.slice(1).join("")
      : cleaned;
    
    const parsed = parseFloat(sanitized);
    return isNaN(parsed) ? undefined : parsed;
  };

  // Initialize display value from prop
  React.useEffect(() => {
    if (value !== undefined) {
      setDisplayValue(formatForDisplay(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow numbers and decimal point
    const numericOnly = inputValue.replace(/[^\d.]/g, "");
    
    // Prevent multiple decimal points
    const parts = numericOnly.split(".");
    const sanitized = parts.length > 2 
      ? parts[0] + "." + parts.slice(1).join("")
      : numericOnly;
    
    setDisplayValue(sanitized);
    
    const parsed = parseInput(sanitized);
    onChange(parsed);
  };

  const handleBlur = () => {
    // Reformat on blur for better UX
    if (value !== undefined) {
      setDisplayValue(formatForDisplay(value));
    }
  };

  return (
    <div className={cn("w-full max-w-[400px]", className)}>
      {label && (
        <label className="text-body text-text-body mb-2 block">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body text-text-body">
          $
        </span>
        <Input
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="0"
          className="pl-7"
          {...props}
        />
      </div>
    </div>
  );
}

