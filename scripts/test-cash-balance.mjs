/**
 * Test cash balance calculation to verify it decreases correctly
 */

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

// Test with realistic scenario where costs > revenue (should decrease)
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

console.log('=== Testing Cash Balance Calculation ===\n');
console.log('Starting Cash:', inputs.cashInBank.toLocaleString());
console.log('Monthly Revenue:', inputs.currentRevenue.toLocaleString());
console.log('Expected: Cash should DECREASE if costs > revenue\n');

let runningCashBalance = inputs.cashInBank;

for (let month = 0; month < 5; month++) {
  const team = calculateTeamForMonth(inputs.teamComposition, inputs.scheduledHires, month);
  const costs = calculateMonthlyCostsForTeam(team, inputs.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(inputs.currentRevenue, inputs.monthlyGrowthRate, month);
  const netFlow = revenue - costs;
  const previousBalance = runningCashBalance;
  runningCashBalance += netFlow;
  
  console.log(`\nMonth ${month}:`);
  console.log(`  Revenue: $${revenue.toLocaleString()}`);
  console.log(`  Costs: $${costs.toLocaleString()}`);
  console.log(`  Net Flow: $${netFlow.toLocaleString()} (${netFlow > 0 ? 'POSITIVE' : 'NEGATIVE'})`);
  console.log(`  Previous Balance: $${previousBalance.toLocaleString()}`);
  console.log(`  New Balance: $${runningCashBalance.toLocaleString()}`);
  console.log(`  Change: ${runningCashBalance > previousBalance ? 'INCREASED ⚠️' : 'DECREASED ✅'} by $${Math.abs(netFlow).toLocaleString()}`);
}

console.log('\n=== Analysis ===');
if (runningCashBalance > inputs.cashInBank) {
  console.log('❌ ERROR: Cash balance is INCREASING when it should DECREASE!');
} else {
  console.log('✅ Cash balance is DECREASING correctly');
}

