"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./animated-number";

interface ProfileCardProps {
  roleName: string;
  salary?: number;
  avatar?: string;
  avatarAlt?: string;
  className?: string;
  badgeCount?: number;
}

export function ProfileCard({
  roleName,
  salary,
  avatar,
  avatarAlt = "Profile photo",
  className,
  badgeCount,
}: ProfileCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center bg-background rounded-[18px] pl-[10px] pr-4 py-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.08)] gap-3 w-full min-w-[200px]",
        className
      )}
    >
      {badgeCount !== undefined && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-medium">
            <AnimatedNumber
              value={badgeCount}
              formatter={(val) => Math.round(val).toString()}
            />
          </span>
        </div>
      )}
      {avatar && (
        <img
          src={avatar}
          alt={avatarAlt}
          className="w-14 h-14 rounded-[12px] object-cover"
        />
      )}
      <div className="flex flex-col min-w-0 flex-1">
        <div className="text-[15px] font-bold text-text-primary leading-[1.2] break-words">
          {roleName}
        </div>
        {salary !== undefined && (
          <div className="mt-1 text-[13px] font-normal text-text-body leading-[1.2] break-words">
            ${salary.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.')}
          </div>
        )}
      </div>
    </div>
  );
}

