'use client';

import { Prediction } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface PredictionDetailsProps {
    predictionResult: Prediction | null;
    userInput: Record<string, number> | null;
}

const SimpleDecisionTree = ({ tree, userInput }: { tree: any, userInput: Record<string, number> | null }) => {
    const renderNode = (node: any, depth = 0, isPathTaken = false): JSX.Element | null => {
        if (!node) return null;

        const isLeaf = !node.children || node.children.length === 0;

        // Function to determine if the current path is taken based on user input
        const checkPath = (n: any): 'left' | 'right' | 'none' => {
            if (!userInput || n.type === 'leaf') return 'none';

            const featureName = n.feature;
            const userValue = userInput[featureName.replace(/\s+/g, '')];

            if (userValue === undefined) return 'none';
            
            return userValue <= n.threshold ? 'left' : 'right';
        };

        const pathDirection = checkPath(node);
        const pathTakenHere = isPathTaken || depth === 0;

        if (isLeaf) {
            const predictionLabel = node.value.indexOf(Math.max(...node.value)) === 1 ? 'Risk Less' : 'Risky';
            return (
                <div className="flex flex-col items-center">
                    <Badge variant={pathTakenHere ? "destructive" : "secondary"}>
                        {predictionLabel}
                    </Badge>
                </div>
            );
        }
        
        const leftChild = node.children[0];
        const rightChild = node.children[1];

        return (
            <div className="flex flex-col items-center">
                <Badge variant="outline" className={cn("border-blue-500 text-blue-500 mb-2", pathTakenHere && "ring-2 ring-blue-500")}>
                    {node.feature} &lt;= {node.threshold.toFixed(2)}?
                </Badge>
                <div className="flex justify-center w-full">
                    <div className="w-1/2 flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">Yes</span>
                        <div className={cn("w-0.5 h-4 bg-muted-foreground my-1", pathTakenHere && pathDirection === 'left' && "bg-blue-500")}></div>
                        {renderNode(leftChild, depth + 1, pathTakenHere && pathDirection === 'left')}
                    </div>
                    <div className="w-1/2 flex flex-col items-center">
                        <span className="text-xs text-muted-foreground">No</span>
                        <div className={cn("w-0.5 h-4 bg-muted-foreground my-1", pathTakenHere && pathDirection === 'right' && "bg-blue-500")}></div>
                        {renderNode(rightChild, depth + 1, pathTakenHere && pathDirection === 'right')}
                    </div>
                </div>
            </div>
        );
    };

    return <div className="p-4">{renderNode(tree, 0, true)}</div>;
};


export const PredictionDetails = ({ predictionResult, userInput }: PredictionDetailsProps) => {
    if (!predictionResult || !predictionResult.forestSimulation) return null;

    const trees = predictionResult.forestSimulation.trees;

    return (
        <div className="mt-8 w-full max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight mb-4 text-center">Prediction Details</h2>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4`}>
                {trees.map((tree) => {
                    const treePrediction = tree.prediction;
                    const treePredictionLabel = treePrediction === 1 ? 'Risk Less' : 'Risky';
                    
                    return (
                        <Card key={tree.id}>
                            <CardHeader>
                                <CardTitle className="text-base">Tree {tree.id + 1}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1 border rounded-lg p-2 h-[300px] overflow-auto">
                                <SimpleDecisionTree tree={tree.tree} userInput={userInput} />
                                <div className='text-center pt-4 border-t'>
                                    <span className='font-semibold'>Prediction: </span>
                                    <span className={cn(treePredictionLabel === 'Risky' ? 'text-red-500' : 'text-green-500', 'font-bold')}>
                                        {treePredictionLabel}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-background rounded-lg border text-center">
                <p className="text-4xl font-bold">
                    Final Prediction: <span className={cn(predictionResult.prediction === 1 ? 'text-green-600' : 'text-red-600')}>
                        {predictionResult.prediction === 1 ? 'Risk Less' : 'Risky'}
                    </span>
                </p>
                <p className="text-muted-foreground mt-2">Based on the majority vote from all decision trees.</p>
            </div>
        </div>
    );
};
