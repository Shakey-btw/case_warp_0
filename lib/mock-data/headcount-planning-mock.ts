import { HeadcountPlanningInputs } from '@/lib/models/headcount-planning';
import { calculateHeadcountPlanning } from '@/lib/calculations/headcount-calculator';

/**
 * Mock data for testing headcount planning calculations
 */
export const mockHeadcountInputs: HeadcountPlanningInputs = {
  cashInBank: 2000000, // $2M in bank
  currentRevenue: 50000, // $50K monthly revenue
  monthlyGrowthRate: 10, // 10% monthly growth
  fixedMonthlySpending: 30000, // $30K fixed monthly costs
  teamComposition: {
    engineer: 5,
    designer: 2,
    accountExecutive: 3,
    recruiting: 1,
  },
  scheduledHires: [
    // Add 2 Account Executives in month 2 (2 months from now)
    { month: 2, type: 'Account Executive', count: 2 },
    // Add 1 Engineer in month 4
    { month: 4, type: 'Engineer', count: 1 },
    // Add 1 Designer in month 6
    { month: 6, type: 'Designer', count: 1 },
  ],
};

/**
 * Example calculation with mock data
 * This can be used for testing and development
 */
export function runMockCalculation() {
  const result = calculateHeadcountPlanning(mockHeadcountInputs);
  
  console.log('=== Headcount Planning Calculation ===');
  console.log('\nInputs:');
  console.log(`Cash in Bank: $${mockHeadcountInputs.cashInBank.toLocaleString()}`);
  console.log(`Current Monthly Revenue: $${mockHeadcountInputs.currentRevenue.toLocaleString()}`);
  console.log(`Monthly Growth Rate: ${mockHeadcountInputs.monthlyGrowthRate}%`);
  console.log(`Fixed Monthly Spending: $${mockHeadcountInputs.fixedMonthlySpending.toLocaleString()}`);
  console.log('\nTeam Composition:');
  console.log(`  Engineers: ${mockHeadcountInputs.teamComposition.engineer}`);
  console.log(`  Designers: ${mockHeadcountInputs.teamComposition.designer}`);
  console.log(`  Account Executives: ${mockHeadcountInputs.teamComposition.accountExecutive}`);
  console.log(`  Recruiting: ${mockHeadcountInputs.teamComposition.recruiting}`);
  
  console.log('\n=== Results ===');
  console.log(`Total Employees: ${result.totalEmployees}`);
  console.log('\nEmployee Costs (Monthly):');
  result.employeeCosts.forEach(cost => {
    const monthlyCostPerEmployee = cost.monthlyCost / cost.count;
    console.log(`  ${cost.type}: ${cost.count} × $${monthlyCostPerEmployee.toLocaleString()} = $${cost.monthlyCost.toLocaleString()}`);
  });
  console.log(`\nTotal Monthly Employee Costs: $${result.totalMonthlyEmployeeCosts.toLocaleString()}`);
  console.log(`Total Monthly Costs (including fixed): $${result.totalMonthlyCosts.toLocaleString()}`);
  console.log(`\nCurrent Monthly Revenue: $${result.monthlyRevenue.toLocaleString()}`);
  console.log(`Projected Monthly Revenue (with growth): $${result.projectedMonthlyRevenue.toLocaleString()}`);
  console.log(`\nMonthly Burn Rate: $${result.monthlyBurnRate.toLocaleString()}`);
  console.log(`Runway: ${result.runwayMonths === Infinity ? 'Infinite' : result.runwayMonths.toFixed(1)} months`);
  
  console.log('\n=== 24-Month Projections (with Scheduled Hires) ===');
  console.log('Month | Revenue      | Costs        | Net Flow     | Cash Balance | Runway | Team Size | New Hires');
  console.log('------|--------------|--------------|--------------|--------------|--------|-----------|----------');
  
  result.monthlyProjections.forEach(projection => {
    const revenue = `$${projection.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`.padEnd(12);
    const costs = `$${projection.totalCosts.toLocaleString(undefined, { maximumFractionDigits: 0 })}`.padEnd(12);
    const netFlow = `$${projection.netCashFlow.toLocaleString(undefined, { maximumFractionDigits: 0 })}`.padEnd(12);
    const cashBalance = `$${projection.cashBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}`.padEnd(12);
    const runway = projection.runwayRemaining === Infinity 
      ? 'Infinite' 
      : projection.runwayRemaining <= 0 
        ? 'Out of cash'
        : `${projection.runwayRemaining.toFixed(1)}m`;
    
    const totalTeamSize = projection.teamComposition.engineer + 
                          projection.teamComposition.designer + 
                          projection.teamComposition.accountExecutive + 
                          projection.teamComposition.recruiting;
    
    const newHiresStr = projection.newHiresThisMonth.length > 0
      ? projection.newHiresThisMonth.map(h => `${h.count} ${h.type}`).join(', ')
      : '-';
    
    console.log(`${projection.monthLabel.padEnd(5)} | ${revenue} | ${costs} | ${netFlow} | ${cashBalance} | ${runway.padEnd(6)} | ${totalTeamSize.toString().padEnd(9)} | ${newHiresStr}`);
  });
  
  return result;
}

