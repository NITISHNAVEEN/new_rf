'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaskType } from "@/lib/types";
import { useMemo } from "react";
import { ChartContainer } from "./ui/chart";

interface SummaryStatisticsProps {
    dataset: Record<string, any>[];
    task: TaskType;
    targetColumn: string;
}

function calculateNumericStats(data: number[]) {
    const n = data.length;
    if (n === 0) return { mean: 0, median: 0, std: 0, min: 0, max: 0 };

    const sorted = [...data].sort((a, b) => a - b);
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;
    const mid = Math.floor(n / 2);
    const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const std = Math.sqrt(data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1)) || 0;
    const min = sorted[0];
    const max = sorted[n - 1];
    
    return { mean, median, std, min, max };
}

export function SummaryStatistics({ dataset, task, targetColumn }: SummaryStatisticsProps) {
    const numericStats = useMemo(() => {
        if (!dataset || dataset.length === 0) return [];
        const numericFeatures = Object.keys(dataset[0] || {}).filter(key => typeof dataset[0][key] === 'number' && key !== targetColumn);
        return numericFeatures.map(feature => {
            const data = dataset.map(row => row[feature]);
            return { feature, ...calculateNumericStats(data) };
        });
    }, [dataset, targetColumn]);

    return (
        <ChartContainer config={{}} className="h-auto w-full">
            <h3 className="font-semibold mb-2">Numeric Features</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Mean</TableHead>
                        <TableHead>Median</TableHead>
                        <TableHead>Std. Dev.</TableHead>
                        <TableHead>Min</TableHead>
                        <TableHead>Max</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {numericStats.map(stat => (
                        <TableRow key={stat.feature}>
                            <TableCell>{stat.feature}</TableCell>
                            <TableCell>{stat.mean.toFixed(2)}</TableCell>
                            <TableCell>{stat.median.toFixed(2)}</TableCell>
                            <TableCell>{stat.std.toFixed(2)}</TableCell>
                            <TableCell>{stat.min.toFixed(2)}</TableCell>
                            <TableCell>{stat.max.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </ChartContainer>
    );
}
