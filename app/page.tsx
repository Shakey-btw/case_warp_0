"use client";

import { useState, useEffect } from "react";
import { MoneyInput } from "@/components/money-input";
import { PercentageInput } from "@/components/percentage-input";
import { TimelineSection } from "@/components/timeline-section";
import { RunwayChart } from "@/components/runway-chart";
import { AnimatedNumber } from "@/components/animated-number";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Copy, X, Share2 } from "lucide-react";
import { HeadcountPlanningInputs, ScheduledHire } from "@/lib/models/headcount-planning";
import { calculateHeadcountPlanning } from "@/lib/calculations/headcount-calculator";
import { EMPLOYEE_TYPE_CONFIGS } from "@/lib/constants/employee-types";
import { EmployeeType } from "@/lib/models/headcount-planning";

export default function Home() {
  // Default values for placeholders
  const defaultValues = {
    cashInBank: 4000000,
    fixedMonthlySpending: 1222000,
    currentRevenue: 1000000,
    monthlyGrowthRate: 5,
  };

  // Initialize with empty values (placeholders will show defaults)
  const [inputs, setInputs] = useState<HeadcountPlanningInputs>({
    cashInBank: 0,
    currentRevenue: 0,
    monthlyGrowthRate: 0,
    fixedMonthlySpending: 0,
    teamComposition: {
      engineer: 12,
      designer: 2,
      accountExecutive: 5,
      recruiting: 3,
    },
    scheduledHires: [],
  });
  
  const [linkedInUrl, setLinkedInUrl] = useState<string>("https://www.linkedin.com/company/joinwarp/");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);
  const [shareUrl, setShareUrl] = useState<string>("");

  // Set share URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  // Calculate results whenever inputs change (use actual values, 0 if empty)
  const results = calculateHeadcountPlanning(inputs);

  // Debug: Log calculation results
  useEffect(() => {
    console.log('=== Calculation Debug ===');
    console.log('Inputs:', {
      cashInBank: inputs.cashInBank,
      currentRevenue: inputs.currentRevenue,
      monthlyGrowthRate: inputs.monthlyGrowthRate,
      fixedMonthlySpending: inputs.fixedMonthlySpending,
      teamComposition: inputs.teamComposition,
    });
    console.log('Results:', {
      totalEmployees: results.totalEmployees,
      totalMonthlyCosts: results.totalMonthlyCosts,
      monthlyRevenue: results.monthlyRevenue,
      monthlyBurnRate: results.monthlyBurnRate,
      projectionsCount: results.monthlyProjections.length,
    });
    if (results.monthlyProjections.length > 0) {
      const first = results.monthlyProjections[0];
      const last = results.monthlyProjections[results.monthlyProjections.length - 1];
      console.log('Cash Balance Trend:', {
        month0: first.cashBalance,
        month23: last.cashBalance,
        trend: last.cashBalance > first.cashBalance ? 'INCREASING ⚠️' : 'DECREASING ✅',
        month0Details: { 
          revenue: first.revenue, 
          costs: first.totalCosts, 
          netFlow: first.netCashFlow,
          team: first.teamComposition,
        },
      });
      // Check if costs are being calculated
      const totalTeamCost = 
        (first.teamComposition.engineer * 200000 * 1.25 / 12) +
        (first.teamComposition.designer * 160000 * 1.25 / 12) +
        (first.teamComposition.accountExecutive * 220000 * 1.25 / 12) +
        (first.teamComposition.recruiting * 140000 * 1.25 / 12);
      console.log('Cost Breakdown Check:', {
        teamCosts: totalTeamCost,
        fixedCosts: inputs.fixedMonthlySpending,
        totalCosts: first.totalCosts,
        match: Math.abs(totalTeamCost + inputs.fixedMonthlySpending - first.totalCosts) < 1,
      });
    }
  }, [results, inputs]);

  const handleCashChange = (value: number | undefined) => {
    setInputs((prev) => ({
      ...prev,
      cashInBank: value ?? 0,
    }));
  };

  const handleFixedCostsChange = (value: number | undefined) => {
    setInputs((prev) => ({
      ...prev,
      fixedMonthlySpending: value ?? 0,
    }));
  };

  const handleCurrentRevenueChange = (value: number | undefined) => {
    setInputs((prev) => ({
      ...prev,
      currentRevenue: value ?? 0,
    }));
  };

  const handleMonthlyGrowthChange = (value: number | undefined) => {
    setInputs((prev) => ({
      ...prev,
      monthlyGrowthRate: value ?? 0,
    }));
  };

  const handleTeamCompositionChange = (type: EmployeeType, count: number) => {
    setInputs((prev) => ({
      ...prev,
      teamComposition: {
        ...prev.teamComposition,
        [type === 'Engineer' ? 'engineer' : 
         type === 'Designer' ? 'designer' :
         type === 'Sales' ? 'accountExecutive' : 'recruiting']: count,
      },
    }));
  };

  const handleScheduledHiresChange = (hires: ScheduledHire[]) => {
    setInputs((prev) => ({
      ...prev,
      scheduledHires: hires,
    }));
  };

  const employeeTypes: EmployeeType[] = ['Engineer', 'Designer', 'Sales', 'Recruiting'];

  const isValidUrl = (urlString: string): boolean => {
    if (!urlString.trim()) return false;
    try {
      const url = new URL(urlString);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!isValidUrl(linkedInUrl)) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Set employee counts after loading
    setInputs((prev) => ({
      ...prev,
      teamComposition: {
        engineer: 10,
        designer: 2,
        accountExecutive: 8, // sales
        recruiting: 2,
      },
    }));
    
    setIsSubmitting(false);
  };

  // Format money value for display in input (show empty if 0, so placeholder shows)
  const formatMoneyForInput = (value: number): string => {
    if (value === 0) return "";
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.');
  };

  // Format percentage value for display in input (show empty if 0, so placeholder shows)
  const formatPercentageForInput = (value: number): string => {
    if (value === 0) return "";
    return value.toString();
  };

  // Get placeholder text for money
  const getMoneyPlaceholder = (defaultValue: number): string => {
    return defaultValue.toLocaleString('en-US', { maximumFractionDigits: 0 }).replace(/,/g, '.');
  };

  // Parse money input (dots are thousands separators, not decimal points)
  const parseMoneyInput = (value: string): number => {
    // Remove all non-digit characters (dots are thousands separators, not decimals)
    const cleaned = value.replace(/[^0-9]/g, '');
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Parse percentage input
  const parsePercentageInput = (value: string): number => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Format burn rate value
  const formatBurnRate = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      // Format as "1.1M" etc.
      const millions = absValue / 1000000;
      // Round to 1 decimal place, but remove trailing zero
      const rounded = Math.round(millions * 10) / 10;
      return `${rounded}M`;
    } else if (absValue >= 1000) {
      // Format as "600k" etc. for thousands
      const thousands = absValue / 1000;
      // Round to nearest integer for k format
      const rounded = Math.round(thousands);
      return `${rounded}k`;
    } else {
      // For values less than 1000, show as is
      return absValue.toString();
    }
  };

  return (
    <main className="min-h-screen bg-background mt-16 mb-16">
      {/* New shadcn form - above all content */}
      <div className="w-full bg-card">
        <div className="container mx-auto px-5 sm:px-6 md:px-12 lg:px-6 xl:px-6 pt-8 pb-0">
          {/* Heading Section */}
          <div className="flex flex-col items-center mb-16">
            {/* SVG Decoration */}
            <div className="mb-8">
              <img src="/decoration.svg" alt="" className="w-[50px] h-[3px]" />
            </div>
            
            {/* Big Heading */}
            <h1 className="text-[48px] font-semibold leading-[60px] tracking-[-1.92px] text-text-primary text-center mb-6">
              Headcount Planning<br />
              Model in 30 Seconds
            </h1>
            
            {/* Subheading */}
            <p className="text-[18px] font-normal leading-[27px] tracking-[-0.36px] text-text-body text-center">
              Warp AI automates registrations, tax-filings, onboarding, and benefits<br />
              so startups never waste time on paperwork or pay surprise fines.
            </p>
          </div>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="flex flex-col md:flex-row gap-4 md:gap-8 lg:gap-16 xl:gap-[200px] justify-center items-center"
          >
            {/* Left column - Input fields */}
            <div className="w-full max-w-[420px] space-y-4">
              {/* Cash in Bank */}
              <div className="space-y-2">
                <label htmlFor="cashInBank" className="text-sm font-medium leading-none text-text-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Cash in Bank
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    id="cashInBank"
                    type="text"
                    value={formatMoneyForInput(inputs.cashInBank)}
                    onChange={(e) => handleCashChange(parseMoneyInput(e.target.value))}
                    placeholder={getMoneyPlaceholder(defaultValues.cashInBank)}
                    className="flex h-10 w-full rounded-[6px] border border-input bg-background pl-7 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-stroke-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Fixed Costs */}
              <div className="space-y-2">
                <label htmlFor="fixedCosts" className="text-sm font-medium leading-none text-text-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Fixed Costs
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                  <input
                    id="fixedCosts"
                    type="text"
                    value={formatMoneyForInput(inputs.fixedMonthlySpending)}
                    onChange={(e) => handleFixedCostsChange(parseMoneyInput(e.target.value))}
                    placeholder={getMoneyPlaceholder(defaultValues.fixedMonthlySpending)}
                    className="flex h-10 w-full rounded-[6px] border border-input bg-background pl-7 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-stroke-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Revenue and Growth per Month */}
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <label htmlFor="revenue" className="text-sm font-medium leading-none text-text-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Revenue
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                    <input
                      id="revenue"
                      type="text"
                      value={formatMoneyForInput(inputs.currentRevenue)}
                      onChange={(e) => handleCurrentRevenueChange(parseMoneyInput(e.target.value))}
                      placeholder={getMoneyPlaceholder(defaultValues.currentRevenue)}
                      className="flex h-10 w-full rounded-[6px] border border-input bg-background pl-7 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:border-stroke-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label htmlFor="growth" className="text-sm font-medium leading-none text-text-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Growth per Month
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
                    <input
                      id="growth"
                      type="text"
                      value={formatPercentageForInput(inputs.monthlyGrowthRate)}
                      onChange={(e) => handleMonthlyGrowthChange(parsePercentageInput(e.target.value))}
                      placeholder={defaultValues.monthlyGrowthRate.toString()}
                      className="flex h-10 w-full rounded-[6px] border border-input bg-background pl-3 pr-7 py-2 text-sm placeholder:text-muted-foreground focus:border-stroke-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Salary Calculation - LinkedIn URL */}
              <div className="space-y-2">
                <label htmlFor="linkedin" className="text-sm font-medium leading-none text-text-body peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Salary Calculation
                </label>
                <div className="flex gap-2">
                  <input
                    id="linkedin"
                    type="url"
                    value={linkedInUrl}
                    onChange={(e) => setLinkedInUrl(e.target.value)}
                    placeholder="https://www.linkedin.com/company/joinwarp/"
                    disabled={isSubmitting}
                    className="flex h-10 w-full rounded-[6px] border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-stroke-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting || !isValidUrl(linkedInUrl)}
                    variant="default"
                    className="rounded-[6px] disabled:opacity-100 disabled:cursor-not-allowed font-normal"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Calculate"
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column - Employee type cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {employeeTypes.map((type) => {
                const config = EMPLOYEE_TYPE_CONFIGS[type];
                const count = inputs.teamComposition[
                  type === 'Engineer' ? 'engineer' : 
                  type === 'Designer' ? 'designer' :
                  type === 'Sales' ? 'accountExecutive' : 'recruiting'
                ];
                
                return (
                  <div key={type}>
                    <ProfileCard
                      roleName={type}
                      salary={config.baseSalary}
                      avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                      avatarAlt={`${type} profile photo`}
                      badgeCount={count}
                    />
                  </div>
                );
              })}
            </div>
          </form>
        </div>
      </div>

      <div className="px-5 sm:px-5 md:px-[64px] pt-20 pb-8">
        {/* Middle section - Two divs */}
        <div className="flex flex-col lg:flex-row gap-5 mt-8 w-full">
          <div className="w-full lg:w-[70%] xl:w-[70%] border border-stroke rounded-box p-8 flex flex-col">
            {/* Heading and Share Button */}
            <div className="flex items-start justify-between">
              <h2 className="text-[20px] font-semibold text-text-primary">
                Cash Runway
              </h2>
              <Button
                variant="secondary"
                onClick={() => setIsShareDialogOpen(true)}
                className="px-4 py-[9px] text-[15px] font-normal leading-[22px] tracking-[-0.3px] hover:bg-[#F8F8F8]"
                size="icon"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Cash in Bank Value */}
            <div className="mt-8">
              <div className="text-[48px] font-semibold text-text-primary leading-[1.15]">
                $<AnimatedNumber
                  value={inputs.cashInBank}
                  formatter={(val) => Math.round(val).toLocaleString('en-US', { maximumFractionDigits: 0, useGrouping: true }).replace(/,/g, '.')}
                />
              </div>
            </div>
            
            {/* Total Cash Label */}
            <div className="mt-4">
              <div className="text-[15px] font-normal text-text-body">
                Total Cash
              </div>
            </div>
            
            {/* Line Chart */}
            <div className="mt-10 h-[240px]">
              <RunwayChart monthlyProjections={results.monthlyProjections} />
            </div>
          </div>
          <div className="w-full lg:w-[30%] xl:w-[30%] border border-stroke rounded-box p-8 flex flex-col">
            {/* Top section - Heading and Button */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-0 mb-auto">
              <h3 className="text-subhead text-text-primary font-medium">Burn Rate</h3>
              <Button 
                variant="secondary" 
                className="px-4 py-[9px] text-[15px] font-normal leading-[22px] tracking-[-0.3px] hover:bg-[#F8F8F8] self-start lg:self-auto"
              >
                Show details
              </Button>
            </div>
            
            {/* Bottom section - Large number and label */}
            <div className="mt-auto flex flex-col items-end">
              <div className="text-[64px] font-semibold leading-[1.15]">
                {results.monthlyBurnRate >= 0 ? (
                  <span className="text-text-primary">
                    $<AnimatedNumber 
                      value={Math.abs(results.monthlyBurnRate)} 
                      formatter={formatBurnRate}
                    />
                  </span>
                ) : (
                  <span className="text-green-600">
                    $<AnimatedNumber 
                      value={Math.abs(results.monthlyBurnRate)} 
                      formatter={formatBurnRate}
                    />
                  </span>
                )}
              </div>
              <div className="mt-5 text-[15px] font-normal text-text-body">
                {results.monthlyBurnRate >= 0 ? 'Monthly Burn' : 'positive cash flow'}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="mt-8">
          <TimelineSection
            scheduledHires={inputs.scheduledHires || []}
            onScheduledHiresChange={handleScheduledHiresChange}
          />
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 mt-4">
            <Input
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button
              variant="default"
              size="icon"
              onClick={async () => {
                if (shareUrl) {
                  await navigator.clipboard.writeText(shareUrl);
                }
              }}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="secondary"
              onClick={() => setIsShareDialogOpen(false)}
              className="px-4"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

