
'use client';

import { useMemo, useState } from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Label } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskType } from '@/lib/types';
import { Card } from './ui/card';

interface PartialDependencePlotProps {
    dataset: Record<string, any>[];
    features: string[];
    task: TaskType;
}

function generateMockPdpData(featureData: number[], task: TaskType) {
    if (featureData.length === 0) return [];
    
    const sortedUniqueValues = [...new Set(featureData)].sort((a, b) => a - b);
    const basePrediction = task === 'regression' ? 2.5 : 0.6;
    
    // Create a slightly more interesting, non-linear effect
    const effect = sortedUniqueValues.map((val, i) => {
        const noise = (Math.random() - 0.5) * 0.1;
        const trend = Math.sin(i / sortedUniqueValues.length * Math.PI * 2) * (task === 'regression' ? 0.5 : 0.2);
        return basePrediction + trend + noise;
    });

    return sortedUniqueValues.map((value, index) => ({
        featureValue: value,
        prediction: effect[index],
    }));
}


export function PartialDependencePlot({ dataset, features, task }: PartialDependencePlotProps) {
    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    const pdpData = useMemo(() => {
        if (!selectedFeature) return [];
        const featureValues = dataset.map(row => row[selectedFeature]).filter(val => typeof val === 'number') as number[];
        return generateMockPdpData(featureValues, task);
    }, [dataset, selectedFeature, task]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                 <div className='w-full md:w-1/4'>
                    <p className='text-sm text-muted-foreground mb-2'>Select a feature to see its effect on the prediction.</p>
                     <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a feature" />
                        </SelectTrigger>
                        <SelectContent>
                            {features.map(feature => (
                                <SelectItem key={feature} value={feature}>
                                    {feature}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                 </div>
            </div>
            <Card className='p-4'>
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer>
                        <LineChart data={pdpData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                type="number" 
                                dataKey="featureValue" 
                                domain={['dataMin', 'dataMax']}
                                tick={{ fontSize: 12 }}
                            >
                                <Label value={selectedFeature} position="bottom" offset={10} fontSize={12}/>
                            </XAxis>
                            <YAxis 
                                domain={['auto', 'auto']}
                                tick={{ fontSize: 12 }}
                            >
                                <Label 
                                    value="Average Prediction" 
                                    angle={-90} 
                                    position="insideLeft" 
                                    offset={-10} 
                                    fontSize={12} 
                                    style={{ textAnchor: 'middle' }}
                                />
                            </YAxis>
                            <Tooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="prediction" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </Card>
        </div>
    );
}

