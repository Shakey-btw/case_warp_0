"use client";

import * as React from "react";
import { EmployeeType, ScheduledHire } from "@/lib/models/headcount-planning";
import { EMPLOYEE_TYPE_CONFIGS } from "@/lib/constants/employee-types";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TimelineSectionProps {
  scheduledHires: ScheduledHire[];
  onScheduledHiresChange: (hires: ScheduledHire[]) => void;
}

function getMonthLabel(monthOffset: number): string {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
}

function DraggableCard({ type }: { type: EmployeeType }) {
  const config = EMPLOYEE_TYPE_CONFIGS[type];
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/employee-type", type);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <ProfileCard
        roleName={type}
        salary={config.baseSalary}
        avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
        avatarAlt={`${type} profile photo`}
      />
    </div>
  );
}

function TimelineMarker({ month, monthLabel }: { month: number; monthLabel: string }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left: `${(month / 23) * 100}%` }}>
      <div className="w-[1px] h-3 bg-stroke" />
      <div className="text-[13px] font-normal text-text-body mt-4 whitespace-nowrap leading-[1.2]">
        {monthLabel}
      </div>
    </div>
  );
}

function TimelineTick({ month }: { month: number }) {
  return (
    <div className="absolute flex flex-col items-center" style={{ left: `${(month / 23) * 100}%` }}>
      <div className="w-[1px] h-1.5 bg-stroke" />
    </div>
  );
}

interface ScheduledHireBadgeProps {
  hire: ScheduledHire;
  index: number;
  position: number;
  onRemove: (index: number) => void;
}

function ScheduledHireBadge({ hire, index, position, onRemove }: ScheduledHireBadgeProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleHireDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("application/scheduled-hire", JSON.stringify({ index, hire }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleHireDragEnd = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(index);
  };

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
      style={{ left: `${position}%` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        draggable
        onDragStart={handleHireDragStart}
        onDragEnd={handleHireDragEnd}
        className={`relative bg-primary text-primary-foreground text-small px-2 py-1 rounded cursor-grab active:cursor-grabbing transition-opacity ${
          isDragging ? "opacity-50" : "opacity-100"
        }`}
      >
        {isHovered && (
          <Button
            onClick={handleRemove}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-md p-0 bg-primary text-primary-foreground border-0"
            aria-label="Remove"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        <span className="whitespace-nowrap">
          {hire.type}
        </span>
      </div>
    </div>
  );
}

export function TimelineSection({ scheduledHires, onScheduledHiresChange }: TimelineSectionProps) {
  const employeeTypes: EmployeeType[] = ['Engineer', 'Designer', 'Sales', 'Recruiting'];
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  // Handle drop outside timeline (delete)
  React.useEffect(() => {
    const handleGlobalDrop = (e: DragEvent) => {
      const scheduledHireData = e.dataTransfer?.getData("application/scheduled-hire");
      if (scheduledHireData) {
        try {
          const { index } = JSON.parse(scheduledHireData);
          // Check if dropped outside the timeline container
          if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            const newHires = scheduledHires.filter((_, idx) => idx !== index);
            onScheduledHiresChange(newHires);
          }
        } catch (error) {
          // Invalid data
        }
      }
    };

    document.addEventListener('drop', handleGlobalDrop);
    return () => {
      document.removeEventListener('drop', handleGlobalDrop);
    };
  }, [scheduledHires, onScheduledHiresChange]);

  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!timelineRef.current) return;

    // Check if it's a scheduled hire being moved
    const scheduledHireData = e.dataTransfer.getData("application/scheduled-hire");
    if (scheduledHireData) {
      try {
        const { index, hire } = JSON.parse(scheduledHireData);
        
        // Calculate which month based on drop position
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, x / rect.width));
        const newMonth = Math.round(percentage * 23); // 0-23 months

        // Update the hire's month
        const newHires = scheduledHires.map((h, idx) =>
          idx === index ? { ...h, month: newMonth } : h
        );

        onScheduledHiresChange(newHires);
        return;
      } catch (error) {
        // Invalid data, continue with employee type logic
      }
    }

    // Handle new employee type drop
    const employeeType = e.dataTransfer.getData("application/employee-type") as EmployeeType;
    if (!employeeType) return;

    // Calculate which month based on drop position
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const month = Math.round(percentage * 23); // 0-23 months

    const existingIndex = scheduledHires.findIndex(
      h => h.month === month && h.type === employeeType
    );

    let newHires: ScheduledHire[];
    if (existingIndex >= 0) {
      newHires = scheduledHires.map((h, idx) =>
        idx === existingIndex ? { ...h, count: h.count + 1 } : h
      );
    } else {
      newHires = [...scheduledHires, { month, type: employeeType, count: 1 }];
    }

    onScheduledHiresChange(newHires);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if we're leaving the timeline area
    if (!timelineRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const months = Array.from({ length: 24 }, (_, i) => ({
    month: i,
    label: getMonthLabel(i),
  }));

  return (
    <div ref={containerRef} className="border border-stroke rounded-box p-6">
      <div className="flex flex-col gap-8">
        {/* Heading */}
        <h2 className="text-[20px] font-semibold text-text-primary text-center">
          Who are you planning to hire?
        </h2>

        {/* Top - Timeline */}
        <div className="w-full">
          <div className="relative">
            {/* Timeline line with drop zone */}
            <div
              ref={timelineRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleTimelineDrop}
              className={`relative h-12 cursor-pointer transition-colors ${
                isDragOver ? "bg-background-secondary" : ""
              }`}
            >
              {/* Horizontal line */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-stroke -translate-y-1/2" />
              
              {/* Small ticks for all months */}
              {months.map(({ month }) => (
                <TimelineTick key={month} month={month} />
              ))}
              
              {/* Month markers with labels - only every 6th month */}
              {months.filter(({ month }) => month % 6 === 0).map(({ month, label }) => (
                <TimelineMarker key={month} month={month} monthLabel={label} />
              ))}

              {/* Scheduled hires on timeline */}
              {scheduledHires.map((hire, idx) => {
                const position = (hire.month / 23) * 100;
                return (
                  <ScheduledHireBadge
                    key={idx}
                    hire={hire}
                    index={idx}
                    position={position}
                    onRemove={(index) => {
                      const newHires = scheduledHires.filter((_, i) => i !== index);
                      onScheduledHiresChange(newHires);
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom - Draggable cards horizontally centered */}
        <div className="flex justify-center gap-4">
          {employeeTypes.map((type) => (
            <DraggableCard key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

