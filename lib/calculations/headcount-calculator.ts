import { 
  HeadcountPlanningInputs, 
  HeadcountPlanningOutputs, 
  EmployeeCosts,
  EmployeeType,
  MonthlyProjection,
  TeamComposition,
  ScheduledHire
} from '@/lib/models/headcount-planning';
import { EMPLOYEE_TYPE_CONFIGS } from '@/lib/constants/employee-types';

/**
 * Calculate the total annual cost for an employee type
 */
function calculateEmployeeAnnualCost(
  baseSalary: number,
  overheadPercentage: number
): number {
  const overheadAmount = baseSalary * (overheadPercentage / 100);
  return baseSalary + overheadAmount;
}

/**
 * Calculate monthly cost from annual cost
 */
function calculateMonthlyCost(annualCost: number): number {
  return annualCost / 12;
}

/**
 * Calculate employee costs for a specific type
 */
function calculateEmployeeTypeCosts(
  type: EmployeeType,
  count: number,
  baseSalary: number,
  overheadPercentage: number
): EmployeeCosts {
  const totalAnnualCost = calculateEmployeeAnnualCost(baseSalary, overheadPercentage);
  const monthlyCost = calculateMonthlyCost(totalAnnualCost);
  
  return {
    type,
    count,
    baseSalary,
    overheadPercentage,
    totalAnnualCost,
    monthlyCost: monthlyCost * count, // Total monthly cost for all employees of this type
  };
}

/**
 * Calculate projected monthly revenue based on current revenue and growth rate
 */
function calculateProjectedMonthlyRevenue(
  currentRevenue: number,
  monthlyGrowthRate: number
): number {
  return currentRevenue * (1 + monthlyGrowthRate / 100);
}

/**
 * Calculate runway in months (how long cash will last)
 */
function calculateRunwayMonths(
  cashInBank: number,
  monthlyBurnRate: number
): number {
  if (monthlyBurnRate <= 0) {
    return Infinity; // Positive cash flow, infinite runway
  }
  return cashInBank / monthlyBurnRate;
}

/**
 * Get month label for a given month offset from today
 */
function getMonthLabel(monthOffset: number): string {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
}

/**
 * Calculate revenue for a specific month with compounding growth
 */
function calculateMonthlyRevenue(
  baseRevenue: number,
  monthlyGrowthRate: number,
  monthOffset: number
): number {
  // Month 0 = current month (no growth applied yet)
  // Month 1 = next month (1 growth period)
  // Month 2 = month after next (2 growth periods), etc.
  const growthMultiplier = Math.pow(1 + monthlyGrowthRate / 100, monthOffset);
  return baseRevenue * growthMultiplier;
}

/**
 * Calculate team composition for a specific month (base team + hires that have started)
 */
function calculateTeamCompositionForMonth(
  baseTeam: TeamComposition,
  scheduledHires: ScheduledHire[],
  targetMonth: number
): TeamComposition {
  // Start with base team
  const team: TeamComposition = {
    engineer: baseTeam.engineer,
    designer: baseTeam.designer,
    accountExecutive: baseTeam.accountExecutive,
    recruiting: baseTeam.recruiting,
  };
  
  // Add all hires that have started by this month (month <= targetMonth)
  scheduledHires.forEach(hire => {
    if (hire.month <= targetMonth) {
      switch (hire.type) {
        case 'Engineer':
          team.engineer += hire.count;
          break;
        case 'Designer':
          team.designer += hire.count;
          break;
        case 'Sales':
          team.accountExecutive += hire.count;
          break;
        case 'Recruiting':
          team.recruiting += hire.count;
          break;
      }
    }
  });
  
  return team;
}

/**
 * Get hires that start in a specific month
 */
function getHiresForMonth(
  scheduledHires: ScheduledHire[],
  targetMonth: number
): ScheduledHire[] {
  return scheduledHires.filter(hire => hire.month === targetMonth);
}

/**
 * Calculate total monthly costs for a given team composition
 */
function calculateMonthlyCostsForTeam(
  team: TeamComposition,
  fixedMonthlySpending: number
): number {
  let totalEmployeeCosts = 0;
  
  // Engineer costs
  if (team.engineer > 0) {
    const annualCost = calculateEmployeeAnnualCost(
      EMPLOYEE_TYPE_CONFIGS.Engineer.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Engineer.overheadPercentage
    );
    totalEmployeeCosts += (calculateMonthlyCost(annualCost) * team.engineer);
  }
  
  // Designer costs
  if (team.designer > 0) {
    const annualCost = calculateEmployeeAnnualCost(
      EMPLOYEE_TYPE_CONFIGS.Designer.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Designer.overheadPercentage
    );
    totalEmployeeCosts += (calculateMonthlyCost(annualCost) * team.designer);
  }
  
  // Sales costs
  if (team.accountExecutive > 0) {
    const annualCost = calculateEmployeeAnnualCost(
      EMPLOYEE_TYPE_CONFIGS['Sales'].baseSalary,
      EMPLOYEE_TYPE_CONFIGS['Sales'].overheadPercentage
    );
    totalEmployeeCosts += (calculateMonthlyCost(annualCost) * team.accountExecutive);
  }
  
  // Recruiting costs
  if (team.recruiting > 0) {
    const annualCost = calculateEmployeeAnnualCost(
      EMPLOYEE_TYPE_CONFIGS.Recruiting.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Recruiting.overheadPercentage
    );
    totalEmployeeCosts += (calculateMonthlyCost(annualCost) * team.recruiting);
  }
  
  return totalEmployeeCosts + fixedMonthlySpending;
}

/**
 * Calculate 24 months of projections with scheduled hires
 */
function calculateMonthlyProjections(
  inputs: HeadcountPlanningInputs,
  initialTotalMonthlyCosts: number
): MonthlyProjection[] {
  const { 
    cashInBank, 
    currentRevenue, 
    monthlyGrowthRate, 
    fixedMonthlySpending,
    teamComposition,
    scheduledHires = [] // Default to empty array if not provided
  } = inputs;
  
  const projections: MonthlyProjection[] = [];
  let runningCashBalance = cashInBank;
  let isOutOfCash = false;
  
  for (let month = 0; month < 24; month++) {
    // If already out of cash, set balance to 0 and skip calculations
    if (isOutOfCash) {
      projections.push({
        month,
        monthLabel: getMonthLabel(month),
        revenue: 0,
        totalCosts: 0,
        netCashFlow: 0,
        cashBalance: 0,
        burnRate: 0,
        runwayRemaining: 0,
        teamComposition: {
          engineer: 0,
          designer: 0,
          accountExecutive: 0,
          recruiting: 0,
        },
        newHiresThisMonth: [],
      });
      continue;
    }
    
    // Calculate team composition for this month (base + hires that have started)
    const teamForMonth = calculateTeamCompositionForMonth(
      teamComposition,
      scheduledHires,
      month
    );
    
    // Get hires that start this month
    const newHiresThisMonth = getHiresForMonth(scheduledHires, month);
    
    // Calculate costs for this month based on current team size
    const totalCosts = calculateMonthlyCostsForTeam(teamForMonth, fixedMonthlySpending);
    
    // Calculate revenue for this month (with compounding growth)
    const revenue = calculateMonthlyRevenue(currentRevenue, monthlyGrowthRate, month);
    
    // Net cash flow
    const netCashFlow = revenue - totalCosts;
    
    // Debug logging for first 3 months
    if (month < 3) {
      console.log(`[Month ${month}] Team:`, teamForMonth, `Costs: $${totalCosts.toLocaleString()}`, `Revenue: $${revenue.toLocaleString()}`, `Net: $${netCashFlow.toLocaleString()}`, `Balance: $${runningCashBalance.toLocaleString()}`);
    }
    
    // Update cash balance
    runningCashBalance += netCashFlow;
    
    // If cash goes to 0 or negative, mark as out of cash and set to 0
    if (runningCashBalance <= 0) {
      isOutOfCash = true;
      runningCashBalance = 0;
    }
    
    // Burn rate (positive = burning cash, negative = positive cash flow)
    const burnRate = totalCosts - revenue;
    
    // Calculate remaining runway
    let runwayRemaining: number;
    if (burnRate <= 0) {
      runwayRemaining = Infinity; // Positive cash flow
    } else if (runningCashBalance <= 0) {
      runwayRemaining = 0; // Out of cash
    } else {
      runwayRemaining = runningCashBalance / burnRate;
    }
    
    projections.push({
      month,
      monthLabel: getMonthLabel(month),
      revenue,
      totalCosts,
      netCashFlow,
      cashBalance: runningCashBalance,
      burnRate,
      runwayRemaining,
      teamComposition: teamForMonth,
      newHiresThisMonth,
    });
  }
  
  return projections;
}

/**
 * Main calculation function for headcount planning
 */
export function calculateHeadcountPlanning(
  inputs: HeadcountPlanningInputs
): HeadcountPlanningOutputs {
  const { 
    cashInBank, 
    currentRevenue, 
    monthlyGrowthRate, 
    fixedMonthlySpending, 
    teamComposition 
  } = inputs;

  // Calculate employee costs for each type
  const employeeCosts: EmployeeCosts[] = [
    calculateEmployeeTypeCosts(
      'Engineer',
      teamComposition.engineer,
      EMPLOYEE_TYPE_CONFIGS.Engineer.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Engineer.overheadPercentage
    ),
    calculateEmployeeTypeCosts(
      'Designer',
      teamComposition.designer,
      EMPLOYEE_TYPE_CONFIGS.Designer.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Designer.overheadPercentage
    ),
    calculateEmployeeTypeCosts(
      'Sales',
      teamComposition.accountExecutive,
      EMPLOYEE_TYPE_CONFIGS['Sales'].baseSalary,
      EMPLOYEE_TYPE_CONFIGS['Sales'].overheadPercentage
    ),
    calculateEmployeeTypeCosts(
      'Recruiting',
      teamComposition.recruiting,
      EMPLOYEE_TYPE_CONFIGS.Recruiting.baseSalary,
      EMPLOYEE_TYPE_CONFIGS.Recruiting.overheadPercentage
    ),
  ];

  // Calculate totals
  const totalEmployees = 
    teamComposition.engineer +
    teamComposition.designer +
    teamComposition.accountExecutive +
    teamComposition.recruiting;

  const totalMonthlyEmployeeCosts = employeeCosts.reduce(
    (sum, cost) => sum + cost.monthlyCost,
    0
  );

  const totalMonthlyCosts = totalMonthlyEmployeeCosts + fixedMonthlySpending;

  const projectedMonthlyRevenue = calculateProjectedMonthlyRevenue(
    currentRevenue,
    monthlyGrowthRate
  );

  const monthlyBurnRate = totalMonthlyCosts - projectedMonthlyRevenue;

  const runwayMonths = calculateRunwayMonths(cashInBank, monthlyBurnRate);

  // Calculate 24 months of projections
  const monthlyProjections = calculateMonthlyProjections(inputs, totalMonthlyCosts);

  return {
    totalEmployees,
    employeeCosts,
    totalMonthlyEmployeeCosts,
    totalMonthlyCosts,
    monthlyRevenue: currentRevenue,
    projectedMonthlyRevenue,
    monthlyBurnRate,
    runwayMonths,
    monthlyProjections,
  };
}

