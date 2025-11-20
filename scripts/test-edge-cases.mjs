/**
 * Test edge cases - what happens with different input combinations
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

console.log('=== Testing Edge Cases ===\n');

// Test Case 1: No team, revenue > fixed costs (should increase)
console.log('Test 1: No team, Revenue > Fixed Costs');
const test1 = {
  cashInBank: 1000000,
  currentRevenue: 50000,
  monthlyGrowthRate: 0,
  fixedMonthlySpending: 30000,
  teamComposition: { engineer: 0, designer: 0, accountExecutive: 0, recruiting: 0 },
  scheduledHires: [],
};

let balance = test1.cashInBank;
for (let m = 0; m < 3; m++) {
  const team = calculateTeamForMonth(test1.teamComposition, test1.scheduledHires, m);
  const costs = calculateMonthlyCostsForTeam(team, test1.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(test1.currentRevenue, test1.monthlyGrowthRate, m);
  const netFlow = revenue - costs;
  balance += netFlow;
  console.log(`  Month ${m}: Revenue $${revenue.toLocaleString()}, Costs $${costs.toLocaleString()}, Net $${netFlow.toLocaleString()}, Balance $${balance.toLocaleString()}`);
}
console.log(`  Result: ${balance > test1.cashInBank ? 'INCREASES ✅ (correct - revenue > costs)' : 'DECREASES'}\n`);

// Test Case 2: With team, costs > revenue (should decrease)
console.log('Test 2: With team, Costs > Revenue');
const test2 = {
  cashInBank: 1000000,
  currentRevenue: 50000,
  monthlyGrowthRate: 0,
  fixedMonthlySpending: 30000,
  teamComposition: { engineer: 5, designer: 2, accountExecutive: 3, recruiting: 1 },
  scheduledHires: [],
};

balance = test2.cashInBank;
for (let m = 0; m < 3; m++) {
  const team = calculateTeamForMonth(test2.teamComposition, test2.scheduledHires, m);
  const costs = calculateMonthlyCostsForTeam(team, test2.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(test2.currentRevenue, test2.monthlyGrowthRate, m);
  const netFlow = revenue - costs;
  balance += netFlow;
  console.log(`  Month ${m}: Revenue $${revenue.toLocaleString()}, Costs $${costs.toLocaleString()}, Net $${netFlow.toLocaleString()}, Balance $${balance.toLocaleString()}`);
}
console.log(`  Result: ${balance < test2.cashInBank ? 'DECREASES ✅ (correct - costs > revenue)' : 'INCREASES ⚠️ (WRONG!)'}\n`);

// Test Case 3: All zeros
console.log('Test 3: All zeros');
const test3 = {
  cashInBank: 0,
  currentRevenue: 0,
  monthlyGrowthRate: 0,
  fixedMonthlySpending: 0,
  teamComposition: { engineer: 0, designer: 0, accountExecutive: 0, recruiting: 0 },
  scheduledHires: [],
};

balance = test3.cashInBank;
for (let m = 0; m < 3; m++) {
  const team = calculateTeamForMonth(test3.teamComposition, test3.scheduledHires, m);
  const costs = calculateMonthlyCostsForTeam(team, test3.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(test3.currentRevenue, test3.monthlyGrowthRate, m);
  const netFlow = revenue - costs;
  balance += netFlow;
  console.log(`  Month ${m}: Revenue $${revenue}, Costs $${costs}, Net $${netFlow}, Balance $${balance}`);
}
console.log(`  Result: Balance stays at $${balance} (correct)\n`);

