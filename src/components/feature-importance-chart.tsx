'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { FeatureImportance } from '@/lib/types';

interface FeatureImportanceChartProps {
  data: FeatureImportance[];
}

export function FeatureImportanceChart({ data }: FeatureImportanceChartProps) {
  const chartData = data.slice(0, 7).sort((a, b) => a.importance - b.importance);

  return (
    <div className="h-[250px] md:h-[350px]">
      <ChartContainer config={{}} className="h-full w-full">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ left: 10, right: 30, top: 20, bottom: 20 }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="feature"
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            width={80}
          />
          <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} content={<ChartTooltipContent />} />
          <Bar dataKey="importance" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
