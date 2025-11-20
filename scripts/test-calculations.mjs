/**
 * Test script for headcount planning calculations
 * Run with: node scripts/test-calculations.mjs
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

console.log('=== HEADCOUNT PLANNING CALCULATION TEST ===\n');

// Step 1: Calculate annual costs per employee type
console.log('STEP 1: Calculate Annual Cost per Employee Type (Base + 25% Overhead)\n');
const annualCosts = {};

for (const [type, config] of Object.entries(employeeConfigs)) {
  const overheadAmount = config.baseSalary * (config.overheadPercentage / 100);
  const totalAnnual = config.baseSalary + overheadAmount;
  annualCosts[type] = totalAnnual;
  
  console.log(`${type}:`);
  console.log(`  Base Salary: $${config.baseSalary.toLocaleString()}`);
  console.log(`  Overhead (25%): $${overheadAmount.toLocaleString()}`);
  console.log(`  Total Annual: $${totalAnnual.toLocaleString()}`);
  console.log(`  Monthly per employee: $${(totalAnnual / 12).toLocaleString()}\n`);
}

// Step 2: Calculate monthly costs per team
console.log('STEP 2: Calculate Monthly Costs per Team\n');
const monthlyCosts = {};

for (const [type, config] of Object.entries(employeeConfigs)) {
  const count = mockInputs.teamComposition[type.toLowerCase().replace(' ', '')] || 
                mockInputs.teamComposition[type === 'Account Executive' ? 'accountExecutive' : type.toLowerCase()];
  const monthlyPerEmployee = annualCosts[type] / 12;
  const totalMonthly = monthlyPerEmployee * count;
  monthlyCosts[type] = { count, monthlyPerEmployee, totalMonthly };
  
  console.log(`${type} (${count} employees):`);
  console.log(`  ${count} × $${monthlyPerEmployee.toLocaleString()} = $${totalMonthly.toLocaleString()}\n`);
}

// Step 3: Calculate totals
console.log('STEP 3: Calculate Totals\n');
const totalMonthlyEmployeeCosts = Object.values(monthlyCosts).reduce(
  (sum, cost) => sum + cost.totalMonthly,
  0
);

const totalMonthlyCosts = totalMonthlyEmployeeCosts + mockInputs.fixedMonthlySpending;

console.log(`Total Monthly Employee Costs: $${totalMonthlyEmployeeCosts.toLocaleString()}`);
console.log(`Fixed Monthly Spending: $${mockInputs.fixedMonthlySpending.toLocaleString()}`);
console.log(`Total Monthly Costs: $${totalMonthlyCosts.toLocaleString()}\n`);

// Step 4: Calculate revenue projections
console.log('STEP 4: Calculate Revenue Projections\n');
const projectedMonthlyRevenue = mockInputs.currentRevenue * (1 + mockInputs.monthlyGrowthRate / 100);

console.log(`Current Monthly Revenue: $${mockInputs.currentRevenue.toLocaleString()}`);
console.log(`Monthly Growth Rate: ${mockInputs.monthlyGrowthRate}%`);
console.log(`Projected Monthly Revenue: $${mockInputs.currentRevenue.toLocaleString()} × 1.10 = $${projectedMonthlyRevenue.toLocaleString()}\n`);

// Step 5: Calculate burn rate and runway
console.log('STEP 5: Calculate Burn Rate and Runway\n');
const monthlyBurnRate = totalMonthlyCosts - projectedMonthlyRevenue;
const runwayMonths = mockInputs.cashInBank / monthlyBurnRate;

console.log(`Monthly Burn Rate: $${totalMonthlyCosts.toLocaleString()} - $${projectedMonthlyRevenue.toLocaleString()} = $${monthlyBurnRate.toLocaleString()}`);
console.log(`Cash in Bank: $${mockInputs.cashInBank.toLocaleString()}`);
console.log(`Runway: $${mockInputs.cashInBank.toLocaleString()} ÷ $${monthlyBurnRate.toLocaleString()} = ${runwayMonths.toFixed(2)} months\n`);

// Summary
console.log('=== SUMMARY ===\n');
console.log(`Total Employees: ${Object.values(monthlyCosts).reduce((sum, c) => sum + c.count, 0)}`);
console.log(`Total Monthly Employee Costs: $${totalMonthlyEmployeeCosts.toLocaleString()}`);
console.log(`Total Monthly Costs: $${totalMonthlyCosts.toLocaleString()}`);
console.log(`Projected Monthly Revenue: $${projectedMonthlyRevenue.toLocaleString()}`);
console.log(`Monthly Burn Rate: $${monthlyBurnRate.toLocaleString()}`);
console.log(`Runway: ${runwayMonths.toFixed(1)} months`);

