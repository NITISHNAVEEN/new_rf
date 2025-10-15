
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMemo } from "react";
import type { TaskType } from "@/lib/types";

interface CorrelationHeatmapProps {
    dataset: Record<string, any>[];
    task: TaskType;
    targetColumn: string;
}

function calculateCorrelationMatrix(dataset: Record<string, any>[], task: TaskType, targetColumn: string) {
    const keys = Object.keys(dataset[0] || {});
    
    const numericKeys = keys.filter(key => {
        const isTargetAndClassification = task === 'classification' && key === targetColumn;
        return typeof dataset[0][key] === 'number' && !isTargetAndClassification;
    });
    
    const n = dataset.length;

    const means = numericKeys.reduce((acc, key) => {
        acc[key] = dataset.reduce((sum, row) => sum + row[key], 0) / n;
        return acc;
    }, {} as Record<string, number>);

    const stdDevs = numericKeys.reduce((acc, key) => {
        const mean = means[key];
        acc[key] = Math.sqrt(dataset.reduce((sum, row) => sum + Math.pow(row[key] - mean, 2), 0) / (n - 1));
        return acc;
    }, {} as Record<string, number>);

    const matrix: Record<string, Record<string, number>> = {};

    for (let i = 0; i < numericKeys.length; i++) {
        const key1 = numericKeys[i];
        matrix[key1] = {};
        for (let j = 0; j < numericKeys.length; j++) {
            const key2 = numericKeys[j];
            if (i === j) {
                matrix[key1][key2] = 1;
                continue;
            }
            if (matrix[key2] && typeof matrix[key2][key1] !== 'undefined') {
                matrix[key1][key2] = matrix[key2][key1];
                continue;
            }

            const mean1 = means[key1];
            const mean2 = means[key2];
            const stdDev1 = stdDevs[key1];
            const stdDev2 = stdDevs[key2];

            if (stdDev1 === 0 || stdDev2 === 0) {
                matrix[key1][key2] = 0;
                continue;
            }

            const covariance = dataset.reduce((sum, row) => sum + (row[key1] - mean1) * (row[key2] - mean2), 0) / (n - 1);
            const correlation = covariance / (stdDev1 * stdDev2);
            matrix[key1][key2] = correlation;
        }
    }
    return matrix;
}

function getColor(value: number) {
  const R = value > 0 ? 255 : 255 - (-value * 255);
  const G = value < 0 ? 255 : 255 - (value * 255);
  const B = 255 - (Math.abs(value) * 255);
  const alpha = Math.abs(value) * 0.7 + 0.3;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

const getCorrelationDescription = (value: number, feature1: string, feature2: string) => {
    const correlationValue = value.toFixed(2);
    if (feature1 === feature2) {
        return `Feature '${feature1}' has a perfect correlation with itself.`;
    }

    let description = '';
    if (value > 0.7) {
        description = 'Strong positive correlation: when one feature increases, the other tends to increase as well.';
    } else if (value > 0.3) {
        description = 'Moderate positive correlation: a tendency for both features to increase together.';
    } else if (value > -0.3) {
        description = 'Weak or no correlation: little to no linear relationship between the features.';
    } else if (value > -0.7) {
        description = 'Moderate negative correlation: a tendency for one feature to increase as the other decreases.';
    } else {
        description = 'Strong negative correlation: when one feature increases, the other tends to decrease.';
    }

    return (
        <div>
            <p className="font-bold">Correlation ({feature1} & {feature2}): {correlationValue}</p>
            <p>{description}</p>
        </div>
    );
};

export function CorrelationHeatmap({ dataset, task, targetColumn }: CorrelationHeatmapProps) {
    const correlationMatrix = useMemo(() => calculateCorrelationMatrix(dataset, task, targetColumn), [dataset, task, targetColumn]);
    const headers = Object.keys(correlationMatrix);

    return (
        <TooltipProvider>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[100px]"></TableHead>
                            {headers.map(header => (
                                <TableHead key={header} className="text-center transform -rotate-45 h-32">
                                    {header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {headers.map(rowHeader => (
                            <TableRow key={rowHeader}>
                                <TableHead>{rowHeader}</TableHead>
                                {headers.map(colHeader => {
                                    const value = correlationMatrix[rowHeader][colHeader];
                                    return (
                                        <TableCell
                                            key={`${rowHeader}-${colHeader}`}
                                            style={{
                                                backgroundColor: getColor(value),
                                            }}
                                            className="p-0"
                                        >
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className="w-full h-full p-4 text-center font-medium"
                                                        style={{
                                                            color: Math.abs(value) > 0.5 ? 'white' : 'black'
                                                        }}
                                                    >
                                                        {value.toFixed(2)}
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-xs">
                                                    {getCorrelationDescription(value, rowHeader, colHeader)}
                                                </TooltipContent>
                                            </Tooltip>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </TooltipProvider>
    );
}
