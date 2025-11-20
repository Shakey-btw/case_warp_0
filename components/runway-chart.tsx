"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { MonthlyProjection } from "@/lib/models/headcount-planning";

interface RunwayChartProps {
  monthlyProjections: MonthlyProjection[];
}

const chartConfig = {
  cashBalance: {
    label: "Cash Balance",
    color: "#0A1111",
  },
} satisfies ChartConfig;

export function RunwayChart({ monthlyProjections }: RunwayChartProps) {
  // Transform monthly projections to chart data
  const chartData = monthlyProjections.map((projection, index) => ({
    month: projection.monthLabel,
    monthIndex: index,
    cashBalance: Math.round(projection.cashBalance),
    revenue: Math.round(projection.revenue),
    costs: Math.round(projection.totalCosts),
    netFlow: Math.round(projection.netCashFlow),
  }));

  // Find the month where cash hits 0 (first month where balance is 0 and previous was > 0)
  const zeroMonthIndex = React.useMemo(() => {
    for (let i = 1; i < chartData.length; i++) {
      if (chartData[i].cashBalance === 0 && chartData[i - 1].cashBalance > 0) {
        return i;
      }
    }
    return null;
  }, [chartData]);

  // Create ticks for x-axis (every 3rd month, plus last month and zero month)
  const xAxisTicks = React.useMemo(() => {
    const tickIndices: number[] = [];
    // Show every 3rd month (0, 3, 6, 9, 12, 15, 18, 21)
    for (let i = 0; i < chartData.length; i += 3) {
      tickIndices.push(i);
    }
    // Always include the last month
    if (tickIndices[tickIndices.length - 1] !== chartData.length - 1) {
      tickIndices.push(chartData.length - 1);
    }
    // Include the zero month if it exists and isn't already in ticks
    if (zeroMonthIndex !== null && !tickIndices.includes(zeroMonthIndex)) {
      tickIndices.push(zeroMonthIndex);
      tickIndices.sort((a, b) => a - b);
    }
    // Return the actual month labels for these indices
    return tickIndices.map(idx => chartData[idx]?.month).filter(Boolean);
  }, [chartData, zeroMonthIndex]);

  // Debug: Log data to console
  React.useEffect(() => {
    console.log('=== RunwayChart Debug ===');
    console.log('monthlyProjections length:', monthlyProjections.length);
    if (monthlyProjections.length > 0) {
      console.log('First 3 months:', chartData.slice(0, 3).map(d => ({ 
        month: d.month, 
        cash: d.cashBalance, 
        revenue: d.revenue, 
        costs: d.costs, 
        netFlow: d.netFlow 
      })));
      console.log('Last 3 months:', chartData.slice(-3).map(d => ({ 
        month: d.month, 
        cash: d.cashBalance, 
        revenue: d.revenue, 
        costs: d.costs, 
        netFlow: d.netFlow 
      })));
      const firstBalance = chartData[0]?.cashBalance;
      const lastBalance = chartData[chartData.length - 1]?.cashBalance;
      const firstNetFlow = chartData[0]?.netFlow;
      console.log(`Cash trend: ${firstBalance} → ${lastBalance} (${lastBalance > firstBalance ? 'INCREASING ⚠️' : 'DECREASING ✅'})`);
      console.log(`First month net flow: $${firstNetFlow?.toLocaleString()} (${firstNetFlow > 0 ? 'POSITIVE' : 'NEGATIVE'})`);
    }
  }, [monthlyProjections, chartData]);

  // Handle empty data
  if (!monthlyProjections || monthlyProjections.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-text-body">
        No data available
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[250px] flex flex-col">
      <ChartContainer config={chartConfig} className="h-full w-full flex-1 [&>div]:!aspect-auto">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 0,
            right: 12,
            top: 12,
            bottom: 12,
          }}
        >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          ticks={xAxisTicks}
          tick={(props: any) => {
            const { x, y, payload } = props;
            // Show full month label with year (e.g., "Jan 2024")
            const label = payload.value;
            
            return (
              <g transform={`translate(${x},${y})`}>
                <text
                  x={0}
                  y={0}
                  dy={16}
                  textAnchor="middle"
                  fill="#525252"
                  fontSize={12}
                >
                  {label}
                </text>
              </g>
            );
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={50}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
          labelFormatter={(value) => {
            const dataPoint = chartData[value];
            return dataPoint ? dataPoint.month : '';
          }}
        />
        <Line
          dataKey="cashBalance"
          type="natural"
          stroke="var(--color-cashBalance)"
          strokeWidth={2}
          dot={{ fill: "var(--color-cashBalance)", r: 4 }}
          activeDot={{ r: 6 }}
        />
        </LineChart>
      </ChartContainer>
    </div>
  );
}

