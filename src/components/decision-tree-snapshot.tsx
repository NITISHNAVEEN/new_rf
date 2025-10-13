'use client';

import React from 'react';
import type { DecisionTree, DecisionNode, LeafNode } from '@/lib/types';

interface NodeDisplayProps {
    node: DecisionNode | LeafNode;
}

const NodeDisplay: React.FC<NodeDisplayProps> = ({ node }) => {
    const isLeaf = node.type === 'leaf';
    const text = isLeaf ? `Value: ${node.value}` : `${node.feature} <= ${node.threshold}`;
    const samples = `Samples: ${node.samples}`;

    return (
        <div className={`
            border-2 border-primary rounded-lg p-3 text-center shadow-md w-48
            ${isLeaf ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : 'bg-card'}
        `}>
            <p className="text-sm font-medium truncate">{text}</p>
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
}

const TreeBranch: React.FC<TreeBranchProps> = ({ node }) => {
    return (
        <div className="flex flex-col items-center">
            <NodeDisplay node={node} />
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
                                    ? <TreeBranch node={child as DecisionNode} />
                                    : <NodeDisplay node={child} />
                                }
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export function DecisionTreeSnapshot({ tree }: { tree: DecisionTree | null }) {
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
            <div className="font-sans flex justify-center">
               {tree.type === 'node'
                    ? <TreeBranch node={tree as DecisionNode} />
                    : <NodeDisplay node={tree} />
                }
            </div>
        </div>
    );
}
