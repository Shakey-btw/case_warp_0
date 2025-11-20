/**
 * Headcount Planning Model Types
 */

export type EmployeeType = 'Engineer' | 'Designer' | 'Sales' | 'Recruiting';

export interface EmployeeTypeConfig {
  type: EmployeeType;
  baseSalary: number; // Annual base salary
  overheadPercentage: number; // Percentage on top (e.g., 25%)
}

export interface TeamComposition {
  engineer: number;
  designer: number;
  accountExecutive: number;
  recruiting: number;
}

export interface ScheduledHire {
  month: number; // 0-23, when the hire starts (0 = current month, 1 = next month, etc.)
  type: EmployeeType;
  count: number; // Number of employees to hire
}

export interface HeadcountPlanningInputs {
  cashInBank: number; // Cash in bank ($)
  currentRevenue: number; // Current Revenue ($)
  monthlyGrowthRate: number; // Monthly Growth Rate (%)
  fixedMonthlySpending: number; // Fixed monthly spending without employee costs ($)
  teamComposition: TeamComposition; // Number of each employee type (current team)
  scheduledHires?: ScheduledHire[]; // Optional: scheduled hires on timeline
}

export interface EmployeeCosts {
  type: EmployeeType;
  count: number;
  baseSalary: number;
  overheadPercentage: number;
  totalAnnualCost: number; // Base + overhead
  monthlyCost: number; // Total annual cost / 12
}

export interface MonthlyProjection {
  month: number; // 0-23 (0 = current month, 1 = next month, etc.)
  monthLabel: string; // Human-readable month label (e.g., "Jan 2024")
  revenue: number; // Revenue for this month (with compounding growth)
  totalCosts: number; // Total costs (employee + fixed)
  netCashFlow: number; // Revenue - costs
  cashBalance: number; // Cash balance at end of month
  burnRate: number; // Costs - revenue (positive = burning, negative = positive cash flow)
  runwayRemaining: number; // Remaining runway in months (Infinity if positive cash flow)
  teamComposition: TeamComposition; // Team composition for this month (base + hires that have started)
  newHiresThisMonth: ScheduledHire[]; // Hires that start this month
}

export interface HeadcountPlanningOutputs {
  totalEmployees: number;
  employeeCosts: EmployeeCosts[];
  totalMonthlyEmployeeCosts: number;
  totalMonthlyCosts: number; // Employee costs + fixed spending
  monthlyRevenue: number; // Current revenue
  projectedMonthlyRevenue: number; // Revenue after growth
  monthlyBurnRate: number; // Total costs - revenue
  runwayMonths: number; // Cash in bank / monthly burn rate
  monthlyProjections: MonthlyProjection[]; // 24 months of projections
}

