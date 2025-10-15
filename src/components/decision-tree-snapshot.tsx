'use client';

import React from 'react';
import type { DecisionTree, DecisionNode, LeafNode, TaskType } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NodeDisplayProps {
    node: DecisionNode | LeafNode;
    taskType: TaskType;
}

const NodeDisplay: React.FC<NodeDisplayProps> = ({ node, taskType }) => {
    const isLeaf = node.type === 'leaf';

    const getRegressionDisplay = (n: DecisionNode | LeafNode) => {
        const value = `Value: ${n.value[0].toFixed(2)}`;
        if (isLeaf) return value;
        const criterion = `${(n as DecisionNode).criterion}: ${(n as DecisionNode).impurity.toFixed(2)}`;
        return `${criterion}\n${value}`;
    };

    const getClassificationDisplay = (n: DecisionNode | LeafNode) => {
        const values = `Samples: [${n.value.join(', ')}]`;
        if (isLeaf) return `Class: ${n.value.indexOf(Math.max(...n.value))}\n${values}`;
        const criterion = `${(n as DecisionNode).criterion}: ${(n as DecisionNode).impurity.toFixed(2)}`;
        return `${criterion}\n${values}`;
    };

    const text = isLeaf ? '' : `${(node as DecisionNode).feature} <= ${'threshold' in node ? (node as DecisionNode).threshold.toFixed(2) : ''}`;
    const samples = `Total Samples: ${node.samples}`;
    const valueDisplay = taskType === 'regression' ? getRegressionDisplay(node) : getClassificationDisplay(node);
    
    return (
        <div className={`
            border-2 border-primary rounded-lg p-3 text-center shadow-md w-48
            ${isLeaf ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-card'}
        `}>
            {text && <p className="text-sm font-medium">{text}</p>}
            <p className="text-xs text-muted-foreground whitespace-pre-line">{valueDisplay}</p>
            <p className="text-xs text-muted-foreground">{samples}</p>
        </div>
    );
};

const Edge = ({ isLeft }: { isLeft: boolean }) => (
    <div className="relative flex-1 pt-10">
        <div className="absolute top-5 left-0 w-full border-t-2 border-dashed border-muted-foreground"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            {isLeft ? 'True' : 'False'}
        </div>
    </div>
);

interface TreeBranchProps {
    node: DecisionNode;
    taskType: TaskType;
}

const TreeBranch: React.FC<TreeBranchProps> = ({ node, taskType }) => {
    return (
        <div className="flex flex-col items-center">
            <NodeDisplay node={node} taskType={taskType} />
            {node.children && (
                <>
                    <div className="flex w-full">
                        <Edge isLeft />
                        <Edge isLeft={false} />
                    </div>
                    <div className="flex w-full justify-around">
                        {node.children.map((child, index) => (
                            <div key={index} className="flex flex-col items-center">
                                {child.type === 'node'
                                    ? <TreeBranch node={child as DecisionNode} taskType={taskType} />
                                    : <NodeDisplay node={child} taskType={taskType} />
                                }
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export function DecisionTreeSnapshot({ tree, taskType }: { tree: DecisionTree | null, taskType: TaskType }) {
     if (!tree) {
        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                Train a model to see a decision tree snapshot.
            </div>
        );
    }
    
    return (
        <div className="p-4 overflow-x-auto">
            <p className="text-sm text-muted-foreground mb-4">
                This is a simplified visualization of a single decision tree from the forest. It shows how the model splits data based on feature values to arrive at a prediction.
            </p>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="font-sans flex justify-center cursor-help">
                           {tree.type === 'node'
                                ? <TreeBranch node={tree as DecisionNode} taskType={taskType} />
                                : <NodeDisplay node={tree} taskType={taskType} />
                            }
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                        <p className="font-bold mb-2">Understanding the Decision Tree</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            <li>Each box is a node in the tree.</li>
                            <li>The top node is the root. Nodes at the bottom are leaves.</li>
                            <li>Decision nodes (non-leaves) show the feature and threshold used to split the data.</li>
                            <li>Leaf nodes show the final prediction for that branch.</li>
                            <li>For classification, `Gini` or `Entropy` measures node impurity. For regression, `MSE` (Mean Squared Error) is used.</li>
                            <li>`Samples` is the number of data points in that node.</li>
                            <li>`Value` in regression nodes is the average prediction. In classification, it shows the count of samples for each class.</li>
                        </ul>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
