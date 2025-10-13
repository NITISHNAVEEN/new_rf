'use client';

import { Scatter, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartDataPoint } from '@/lib/types';

interface PredictionPlotProps {
  data: ChartDataPoint[] | null;
}

export function PredictionPlot({ data }: PredictionPlotProps) {
    if (!data) return null;

    const domain = [
        Math.min(...data.map(d => d.actual), ...data.map(d => d.prediction)),
        Math.max(...data.map(d => d.actual), ...data.map(d => d.prediction))
    ];
    
  return (
    <div className="h-[250px] md:h-[350px]">
      <ChartContainer config={{}} className="h-full w-full">
        <ScatterChart margin={{ left: 0, right: 20, top: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="actual" 
            name="Actual" 
            domain={domain}
            tick={{ fontSize: 12 }} 
            label={{ value: 'Actual Values', position: 'insideBottom', offset: -10, fontSize: 12 }} 
          />
          <YAxis 
            type="number" 
            dataKey="prediction" 
            name="Predicted"
            domain={domain}
            tick={{ fontSize: 12 }}
            label={{ value: 'Predictions', angle: -90, position: 'insideLeft', offset: 10, fontSize: 12 }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<ChartTooltipContent />} />
          <Scatter name="Predictions" data={data} fill="hsl(var(--primary))" />
          <Line type="monotone" dataKey="actual" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} activeDot={false} isAnimationActive={false} name="Ideal" />
        </ScatterChart>
      </ChartContainer>
    </div>
  );
}
