import { EmployeeTypeConfig } from '@/lib/models/headcount-planning';

/**
 * Employee type configurations with base salaries and overhead percentages
 */
export const EMPLOYEE_TYPE_CONFIGS: Record<string, EmployeeTypeConfig> = {
  Engineer: {
    type: 'Engineer',
    baseSalary: 200000,
    overheadPercentage: 25,
  },
  Designer: {
    type: 'Designer',
    baseSalary: 160000,
    overheadPercentage: 25,
  },
  'Sales': {
    type: 'Sales',
    baseSalary: 220000,
    overheadPercentage: 25,
  },
  Recruiting: {
    type: 'Recruiting',
    baseSalary: 140000,
    overheadPercentage: 25,
  },
};

