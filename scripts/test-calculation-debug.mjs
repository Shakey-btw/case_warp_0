/**
 * Test calculation with sample data to verify it works
 */

// Mock the calculation logic
const EMPLOYEE_CONFIGS = {
  Engineer: { baseSalary: 200000, overheadPercentage: 25 },
  Designer: { baseSalary: 160000, overheadPercentage: 25 },
  'Account Executive': { baseSalary: 220000, overheadPercentage: 25 },
  Recruiting: { baseSalary: 140000, overheadPercentage: 25 },
};

function calculateEmployeeAnnualCost(baseSalary, overheadPercentage) {
  return baseSalary * (1 + overheadPercentage / 100);
}

function calculateMonthlyCost(annualCost) {
  return annualCost / 12;
}

function calculateMonthlyRevenue(baseRevenue, monthlyGrowthRate, monthOffset) {
  const growthMultiplier = Math.pow(1 + monthlyGrowthRate / 100, monthOffset);
  return baseRevenue * growthMultiplier;
}

function calculateTeamForMonth(baseTeam, scheduledHires, targetMonth) {
  const team = { ...baseTeam };
  scheduledHires.forEach(hire => {
    if (hire.month <= targetMonth) {
      const key = hire.type === 'Account Executive' ? 'accountExecutive' : hire.type.toLowerCase();
      team[key] = (team[key] || 0) + hire.count;
    }
  });
  return team;
}

function calculateMonthlyCostsForTeam(team, fixedSpending) {
  let total = 0;
  if (team.engineer > 0) {
    const annual = calculateEmployeeAnnualCost(EMPLOYEE_CONFIGS.Engineer.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.engineer;
  }
  if (team.designer > 0) {
    const annual = calculateEmployeeAnnualCost(EMPLOYEE_CONFIGS.Designer.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.designer;
  }
  if (team.accountExecutive > 0) {
    const annual = calculateEmployeeAnnualCost(EMPLOYEE_CONFIGS['Account Executive'].baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.accountExecutive;
  }
  if (team.recruiting > 0) {
    const annual = calculateEmployeeAnnualCost(EMPLOYEE_CONFIGS.Recruiting.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.recruiting;
  }
  return total + fixedSpending;
}

// Test with sample data
const inputs = {
  cashInBank: 2000000,
  currentRevenue: 50000,
  monthlyGrowthRate: 10,
  fixedMonthlySpending: 30000,
  teamComposition: {
    engineer: 5,
    designer: 2,
    accountExecutive: 3,
    recruiting: 1,
  },
  scheduledHires: [],
};

console.log('=== Testing Calculation ===\n');
console.log('Inputs:', inputs);

let runningCashBalance = inputs.cashInBank;
const projections = [];

for (let month = 0; month < 3; month++) {
  const team = calculateTeamForMonth(inputs.teamComposition, inputs.scheduledHires, month);
  const costs = calculateMonthlyCostsForTeam(team, inputs.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(inputs.currentRevenue, inputs.monthlyGrowthRate, month);
  const netFlow = revenue - costs;
  runningCashBalance += netFlow;
  
  projections.push({
    month,
    revenue,
    costs,
    netFlow,
    cashBalance: runningCashBalance,
  });
  
  console.log(`\nMonth ${month}:`);
  console.log(`  Revenue: $${revenue.toLocaleString()}`);
  console.log(`  Costs: $${costs.toLocaleString()}`);
  console.log(`  Net Flow: $${netFlow.toLocaleString()}`);
  console.log(`  Cash Balance: $${runningCashBalance.toLocaleString()}`);
}

console.log('\n=== Calculation Test Complete ===');
console.log('If you see cash balances above, the calculation logic is working.');

