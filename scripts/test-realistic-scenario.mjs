/**
 * Test with realistic scenario where costs should definitely exceed revenue
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

console.log('=== Realistic Scenario Test ===\n');
console.log('Scenario: Small startup with employees, low revenue\n');

const scenario = {
  cashInBank: 2000000, // $2M in bank
  currentRevenue: 50000, // $50K/month revenue
  monthlyGrowthRate: 5, // 5% growth
  fixedMonthlySpending: 20000, // $20K fixed costs
  teamComposition: { 
    engineer: 3, 
    designer: 2, 
    accountExecutive: 2, 
    recruiting: 1 
  },
  scheduledHires: [],
};

console.log('Inputs:');
console.log(`  Cash: $${scenario.cashInBank.toLocaleString()}`);
console.log(`  Revenue: $${scenario.currentRevenue.toLocaleString()}/month`);
console.log(`  Growth: ${scenario.monthlyGrowthRate}%/month`);
console.log(`  Fixed Costs: $${scenario.fixedMonthlySpending.toLocaleString()}/month`);
console.log(`  Team: ${scenario.teamComposition.engineer} Engineers, ${scenario.teamComposition.designer} Designers, ${scenario.teamComposition.accountExecutive} AEs, ${scenario.teamComposition.recruiting} Recruiters\n`);

// Calculate first month costs
const firstMonthTeam = calculateTeamForMonth(scenario.teamComposition, scenario.scheduledHires, 0);
const firstMonthCosts = calculateMonthlyCostsForTeam(firstMonthTeam, scenario.fixedMonthlySpending);
const firstMonthRevenue = calculateMonthlyRevenue(scenario.currentRevenue, scenario.monthlyGrowthRate, 0);

console.log('First Month Calculation:');
console.log(`  Employee Costs: $${(firstMonthCosts - scenario.fixedMonthlySpending).toLocaleString()}`);
console.log(`  Fixed Costs: $${scenario.fixedMonthlySpending.toLocaleString()}`);
console.log(`  Total Costs: $${firstMonthCosts.toLocaleString()}`);
console.log(`  Revenue: $${firstMonthRevenue.toLocaleString()}`);
console.log(`  Net Flow: $${(firstMonthRevenue - firstMonthCosts).toLocaleString()}`);
console.log(`  Expected: ${firstMonthCosts > firstMonthRevenue ? 'NEGATIVE (cash decreases) ✅' : 'POSITIVE (cash increases) ⚠️'}\n`);

// Calculate 24 months
let balance = scenario.cashInBank;
const balances = [balance];

for (let m = 0; m < 24; m++) {
  const team = calculateTeamForMonth(scenario.teamComposition, scenario.scheduledHires, m);
  const costs = calculateMonthlyCostsForTeam(team, scenario.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(scenario.currentRevenue, scenario.monthlyGrowthRate, m);
  const netFlow = revenue - costs;
  balance += netFlow;
  balances.push(balance);
  
  if (m < 3 || m >= 21) {
    console.log(`Month ${m}: Balance $${balance.toLocaleString()} (${netFlow > 0 ? '+' : ''}$${netFlow.toLocaleString()})`);
  }
}

console.log(`\nFinal Balance: $${balance.toLocaleString()}`);
console.log(`Change: $${(balance - scenario.cashInBank).toLocaleString()} (${balance > scenario.cashInBank ? 'INCREASED ⚠️' : 'DECREASED ✅'})`);
console.log(`\nTrend: ${balances[0] > balances[balances.length - 1] ? 'DECREASING ✅' : 'INCREASING ⚠️'}`);

