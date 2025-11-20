/**
 * Test script for scheduled hires functionality
 * Run with: node scripts/test-scheduled-hires.mjs
 */

// Mock data with scheduled hires
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
  scheduledHires: [
    { month: 2, type: 'Account Executive', count: 2 }, // Add 2 AEs in month 2
    { month: 4, type: 'Engineer', count: 1 }, // Add 1 Engineer in month 4
    { month: 6, type: 'Designer', count: 1 }, // Add 1 Designer in month 6
  ],
};

// Employee configurations
const employeeConfigs = {
  Engineer: { baseSalary: 200000, overheadPercentage: 25 },
  Designer: { baseSalary: 160000, overheadPercentage: 25 },
  'Account Executive': { baseSalary: 220000, overheadPercentage: 25 },
  Recruiting: { baseSalary: 140000, overheadPercentage: 25 },
};

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

function calculateEmployeeAnnualCost(baseSalary, overheadPercentage) {
  return baseSalary * (1 + overheadPercentage / 100);
}

function calculateMonthlyCost(annualCost) {
  return annualCost / 12;
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

function getHiresForMonth(scheduledHires, targetMonth) {
  return scheduledHires.filter(hire => hire.month === targetMonth);
}

function calculateMonthlyCostsForTeam(team, fixedSpending) {
  let total = 0;
  
  if (team.engineer > 0) {
    const annual = calculateEmployeeAnnualCost(employeeConfigs.Engineer.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.engineer;
  }
  if (team.designer > 0) {
    const annual = calculateEmployeeAnnualCost(employeeConfigs.Designer.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.designer;
  }
  if (team.accountExecutive > 0) {
    const annual = calculateEmployeeAnnualCost(employeeConfigs['Account Executive'].baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.accountExecutive;
  }
  if (team.recruiting > 0) {
    const annual = calculateEmployeeAnnualCost(employeeConfigs.Recruiting.baseSalary, 25);
    total += calculateMonthlyCost(annual) * team.recruiting;
  }
  
  return total + fixedSpending;
}

console.log('=== SCHEDULED HIRES TEST ===\n');
console.log('Base Team:');
console.log(`  Engineers: ${mockInputs.teamComposition.engineer}`);
console.log(`  Designers: ${mockInputs.teamComposition.designer}`);
console.log(`  Account Executives: ${mockInputs.teamComposition.accountExecutive}`);
console.log(`  Recruiting: ${mockInputs.teamComposition.recruiting}\n`);

console.log('Scheduled Hires:');
mockInputs.scheduledHires.forEach(hire => {
  console.log(`  Month ${hire.month}: ${hire.count} ${hire.type}`);
});
console.log('');

console.log('=== 24-MONTH PROJECTIONS WITH SCHEDULED HIRES ===\n');
console.log('Month      | Team Size | E | D | AE | R | New Hires        | Costs        | Revenue     | Cash Balance');
console.log('-----------|-----------|---|---|----|---|------------------|--------------|-------------|-------------');

let runningCashBalance = mockInputs.cashInBank;

for (let month = 0; month < 12; month++) {
  const team = calculateTeamForMonth(mockInputs.teamComposition, mockInputs.scheduledHires, month);
  const newHires = getHiresForMonth(mockInputs.scheduledHires, month);
  const costs = calculateMonthlyCostsForTeam(team, mockInputs.fixedMonthlySpending);
  const revenue = calculateMonthlyRevenue(mockInputs.currentRevenue, mockInputs.monthlyGrowthRate, month);
  const netFlow = revenue - costs;
  runningCashBalance += netFlow;
  
  const totalTeamSize = team.engineer + team.designer + team.accountExecutive + team.recruiting;
  const newHiresStr = newHires.length > 0 
    ? newHires.map(h => `${h.count} ${h.type}`).join(', ')
    : '-';
  
  const monthLabel = getMonthLabel(month);
  console.log(
    `${monthLabel.padEnd(10)} | ${totalTeamSize.toString().padEnd(9)} | ${team.engineer} | ${team.designer} | ${team.accountExecutive.toString().padEnd(2)} | ${team.recruiting} | ${newHiresStr.padEnd(16)} | $${Math.round(costs).toLocaleString().padEnd(11)} | $${Math.round(revenue).toLocaleString().padEnd(10)} | $${Math.round(runningCashBalance).toLocaleString()}`
  );
  
  if (runningCashBalance <= 0) break;
}

console.log('\n=== Key Changes ===');
console.log('Month 0: Base team (11 employees)');
console.log('Month 2: +2 Account Executives → 13 employees, costs increase');
console.log('Month 4: +1 Engineer → 14 employees, costs increase');
console.log('Month 6: +1 Designer → 15 employees, costs increase');

