/**
 * Test script for 24-month headcount planning projections
 * Run with: node scripts/test-monthly-projections.mjs
 */

// Mock data
const mockInputs = {
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
};

// Employee configurations
const employeeConfigs = {
  Engineer: { baseSalary: 200000, overheadPercentage: 25 },
  Designer: { baseSalary: 160000, overheadPercentage: 25 },
  'Account Executive': { baseSalary: 220000, overheadPercentage: 25 },
  Recruiting: { baseSalary: 140000, overheadPercentage: 25 },
};

// Calculate annual and monthly costs
const annualCosts = {};
const monthlyCosts = {};

for (const [type, config] of Object.entries(employeeConfigs)) {
  const totalAnnual = config.baseSalary * 1.25; // Base + 25%
  annualCosts[type] = totalAnnual;
  const monthlyPerEmployee = totalAnnual / 12;
  
  const count = mockInputs.teamComposition[type.toLowerCase().replace(' ', '')] || 
                mockInputs.teamComposition[type === 'Account Executive' ? 'accountExecutive' : type.toLowerCase()];
  monthlyCosts[type] = monthlyPerEmployee * count;
}

const totalMonthlyEmployeeCosts = Object.values(monthlyCosts).reduce((sum, cost) => sum + cost, 0);
const totalMonthlyCosts = totalMonthlyEmployeeCosts + mockInputs.fixedMonthlySpending;

// Helper functions
function getMonthLabel(monthOffset) {
  const today = new Date();
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[targetDate.getMonth()]} ${targetDate.getFullYear()}`;
}

function calculateMonthlyRevenue(baseRevenue, monthlyGrowthRate, monthOffset) {
  const growthMultiplier = Math.pow(1 + monthlyGrowthRate / 100, monthOffset);
  return baseRevenue * growthMultiplier;
}

// Calculate 24 months of projections
console.log('=== 24-MONTH RUNWAY PROJECTIONS ===\n');
console.log('Starting Conditions:');
console.log(`  Cash in Bank: $${mockInputs.cashInBank.toLocaleString()}`);
console.log(`  Current Monthly Revenue: $${mockInputs.currentRevenue.toLocaleString()}`);
console.log(`  Monthly Growth Rate: ${mockInputs.monthlyGrowthRate}%`);
console.log(`  Total Monthly Costs: $${totalMonthlyCosts.toLocaleString()}\n`);

console.log('Month-by-Month Projections:\n');
console.log('Month      | Revenue      | Costs        | Net Flow     | Cash Balance | Runway');
console.log('-----------|--------------|--------------|--------------|--------------|------------');

let runningCashBalance = mockInputs.cashInBank;

for (let month = 0; month < 24; month++) {
  const revenue = calculateMonthlyRevenue(mockInputs.currentRevenue, mockInputs.monthlyGrowthRate, month);
  const totalCosts = totalMonthlyCosts;
  const netCashFlow = revenue - totalCosts;
  runningCashBalance += netCashFlow;
  const burnRate = totalCosts - revenue;
  
  let runwayRemaining;
  if (burnRate <= 0) {
    runwayRemaining = 'Infinite';
  } else if (runningCashBalance <= 0) {
    runwayRemaining = 'Out of cash';
  } else {
    runwayRemaining = `${(runningCashBalance / burnRate).toFixed(1)}m`;
  }
  
  const monthLabel = getMonthLabel(month);
  const revenueStr = `$${Math.round(revenue).toLocaleString()}`.padEnd(12);
  const costsStr = `$${Math.round(totalCosts).toLocaleString()}`.padEnd(12);
  const netFlowStr = `$${Math.round(netCashFlow).toLocaleString()}`.padEnd(12);
  const cashBalanceStr = `$${Math.round(runningCashBalance).toLocaleString()}`.padEnd(12);
  
  console.log(`${monthLabel.padEnd(10)} | ${revenueStr} | ${costsStr} | ${netFlowStr} | ${cashBalanceStr} | ${runwayRemaining}`);
  
  // Stop if out of cash
  if (runningCashBalance <= 0 && month < 23) {
    console.log(`\n⚠️  Out of cash in month ${month + 1}`);
    break;
  }
}

console.log('\n=== Key Insights ===');
const firstMonth = calculateMonthlyRevenue(mockInputs.currentRevenue, mockInputs.monthlyGrowthRate, 0);
const lastMonth = calculateMonthlyRevenue(mockInputs.currentRevenue, mockInputs.monthlyGrowthRate, 23);
console.log(`Revenue growth: $${Math.round(firstMonth).toLocaleString()} → $${Math.round(lastMonth).toLocaleString()}`);
console.log(`Total revenue over 24 months: $${Array.from({length: 24}, (_, i) => 
  calculateMonthlyRevenue(mockInputs.currentRevenue, mockInputs.monthlyGrowthRate, i)
).reduce((sum, rev) => sum + rev, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`);

