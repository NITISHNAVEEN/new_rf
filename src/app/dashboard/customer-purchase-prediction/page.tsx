
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Sparkles,
  Vote,
  Users,
  ShieldCheck,
  BarChart,
  Info,
  ArrowDown,
  User,
  BadgeDollarSign,
  School,
  Star,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type CustomerDetails = {
  age: 'Youth' | 'Middle Aged' | 'Senior';
  income: 'High' | 'Medium' | 'Low';
  student: 'Yes' | 'No';
  creditRating: 'Fair' | 'Excellent';
};

type TreeNodeProps = {
  condition: string;
  isPath?: boolean;
  isLeaf?: boolean;
  result?: 'Buy' | 'Don\'t Buy';
  children?: React.ReactNode;
};

const TreeNode = ({
  condition,
  isPath,
  isLeaf,
  result,
  children,
}: TreeNodeProps) => (
  <div className="flex flex-col items-center relative">
    <div
      className={cn(
        'p-1.5 rounded-md border-2 bg-card text-card-foreground shadow-sm transition-all duration-500 min-w-[90px] text-center text-xs',
        {
          'border-primary bg-primary/10': isPath,
          'border-destructive bg-destructive/10':
            isLeaf && result === 'Don\'t Buy' && isPath,
          'border-green-500 bg-green-500/10':
            isLeaf && result === 'Buy' && isPath,
        }
      )}
    >
      <p className="font-semibold">{isLeaf ? result : condition}</p>
    </div>
    {children && (
      <div className="flex justify-center mt-4 space-x-2 relative">
        {children}
      </div>
    )}
  </div>
);

type DecisionTreeProps = {
  conditions: CustomerDetails | null;
  treeId: number;
  isActive: boolean;
};

const DecisionTree = ({ conditions, treeId, isActive }: DecisionTreeProps) => {
  const [paths, setPaths] = React.useState<string[]>([]);
  const seed = treeId;
  const conditionOptions = ['age', 'student', 'creditRating', 'income'];
  const op1 = conditionOptions[seed % 4];
  const op2 = conditionOptions[(seed + 1) % 4];
  const op3 = conditionOptions[(seed + 2) % 4];

  React.useEffect(() => {
    if (isActive && conditions) {
      let currentPath: string[] = ['root'];

      const checkCondition = (op: string) => {
        const val = conditions[op as keyof CustomerDetails];
        const seedValue = (seed + op.length);
        if (op === 'age') return val === ['Youth', 'Middle Aged', 'Senior'][seedValue % 3];
        if (op === 'student') return val === 'Yes';
        if (op === 'creditRating') return val === 'Excellent';
        if (op === 'income') return val === ['High', 'Medium', 'Low'][seedValue % 3];
        return false;
      };

      if (checkCondition(op1)) {
        currentPath.push(`${op1}>`);
        if (checkCondition(op2)) {
          currentPath.push(`${op1}>_${op2}>`);
        } else {
          currentPath.push(`${op1}>_${op2}<=`);
        }
      } else {
        currentPath.push(`${op1}<=`);
        if (checkCondition(op3)) {
          currentPath.push(`${op1}<=_${op3}>`);
        } else {
          currentPath.push(`${op1}<=_${op3}<=`);
        }
      }
      setPaths(currentPath);
    } else if (!isActive) {
      setPaths([]);
    }
  }, [isActive, conditions, treeId, op1, op2, op3, seed]);

  const isPath = (id: string) => isActive && paths.includes(id);

  const getConditionString = (op: string) => {
    const seedValue = (seed + op.length);
    if (op === 'age') return `Age is ${['Youth', 'Mid-Age', 'Senior'][seedValue % 3]}?`;
    if (op === 'student') return 'Is a Student?';
    if (op === 'creditRating') return 'Credit is Excellent?';
    if (op === 'income') return `Income is ${['High', 'Med', 'Low'][seedValue % 3]}?`;
    return '';
  };
  
  const getResult = (pathSeed: number) => (pathSeed % 3 === 0 ? 'Don\'t Buy' : 'Buy');

  return (
    <TreeNode condition={getConditionString(op1)} isPath={isPath('root')}>
      <div className="flex flex-col items-center">
        <span className="text-xs mb-1 absolute -top-4">Yes</span>
        <TreeNode condition={getConditionString(op2)} isPath={isPath(`${op1}>`)}>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">Yes</span>
            <TreeNode isLeaf result={getResult(seed + 1)} isPath={isPath(`${op1}>_${op2}>`)} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">No</span>
            <TreeNode isLeaf result={getResult(seed + 2)} isPath={isPath(`${op1}>_${op2}<=`)} />
          </div>
        </TreeNode>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs mb-1 absolute -top-4">No</span>
        <TreeNode condition={getConditionString(op3)} isPath={isPath(`${op1}<=`)}>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">Yes</span>
            <TreeNode isLeaf result={getResult(seed + 3)} isPath={isPath(`${op1}<=_${op3}>`)} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">No</span>
            <TreeNode isLeaf result={getResult(seed + 4)} isPath={isPath(`${op1}<=_${op3}<=`)} />
          </div>
        </TreeNode>
      </div>
    </TreeNode>
  );
};


export default function PredictPage() {
  const router = useRouter();
  const [conditions, setConditions] = React.useState<CustomerDetails>({
    age: 'Youth',
    income: 'Medium',
    student: 'No',
    creditRating: 'Fair',
  });
  const [conditionsForPrediction, setConditionsForPrediction] = React.useState<CustomerDetails | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPredicting, setIsPredicting] = React.useState(false);
  const [prediction, setPrediction] = React.useState<'Buy' | 'Don\'t Buy' | null>(null);
  const [treeResults, setTreeResults] = React.useState<('Buy' | 'Don\'t Buy')[]>([]);
  const [numTrees, setNumTrees] = useState(3);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setConditions((prev) => ({ ...prev, [field]: value as any }));
    reset();
  };

  const handlePredict = () => {
    setIsPredicting(true);
    setConditionsForPrediction(conditions);
  };

  React.useEffect(() => {
    if (isPredicting && conditionsForPrediction) {
      const timeoutId = setTimeout(() => {
        const results: ('Buy' | 'Don\'t Buy')[] = [];
        for (let i = 1; i <= numTrees; i++) {
          const seed = i;
          const conditionOptions = ['age', 'student', 'creditRating', 'income'];
          const op1 = conditionOptions[seed % 4];
          const op2 = conditionOptions[(seed + 1) % 4];
          const op3 = conditionOptions[(seed + 2) % 4];

          const checkCondition = (op: string) => {
            const val = conditionsForPrediction[op as keyof CustomerDetails];
            const seedValue = (seed + op.length);
            if (op === 'age') return val === ['Youth', 'Middle Aged', 'Senior'][seedValue % 3];
            if (op === 'student') return val === 'Yes';
            if (op === 'creditRating') return val === 'Excellent';
            if (op === 'income') return val === ['High', 'Medium', 'Low'][seedValue % 3];
            return false;
          };

          const getResult = (pathSeed: number) => (pathSeed % 3 === 0 ? 'Don\'t Buy' : 'Buy');

          let result: 'Buy' | 'Don\'t Buy';
          if (checkCondition(op1)) {
            if (checkCondition(op2)) {
              result = getResult(seed + 1);
            } else {
              result = getResult(seed + 2);
            }
          } else {
            if (checkCondition(op3)) {
              result = getResult(seed + 3);
            } else {
              result = getResult(seed + 4);
            }
          }
          results.push(result);
        }

        setTreeResults(results);

        const playCount = results.filter((r) => r === 'Buy').length;
        const finalPrediction = playCount >= numTrees / 2 ? 'Buy' : 'Don\'t Buy';

        setPrediction(finalPrediction);
        setIsPredicting(false);
      }, 1500); // Wait for animations to play

      return () => clearTimeout(timeoutId);
    }
  }, [isPredicting, conditionsForPrediction, numTrees]);

  const reset = () => {
    setPrediction(null);
    setTreeResults([]);
    setConditionsForPrediction(null);
  };

  const allFieldsFilled =
    conditions.age && conditions.income && conditions.student && conditions.creditRating;

  if (!isMounted) {
    return null;
  }

  const buyVotes = prediction ? treeResults.filter((r) => r === 'Buy').length : 0;
  const dontBuyVotes = prediction ? treeResults.length - buyVotes : 0;

  const customerInputs = [
    { id: 'age', field: 'age', label: 'Age Group', icon: User, tooltip: 'The age group of the customer.', options: ['Youth', 'Middle Aged', 'Senior'] },
    { id: 'income', field: 'income', label: 'Income Level', icon: BadgeDollarSign, tooltip: 'The income level of the customer.', options: ['High', 'Medium', 'Low'] },
    { id: 'student', field: 'student', label: 'Is Student?', icon: School, tooltip: 'Whether the customer is a student.', options: ['Yes', 'No'] },
    { id: 'creditRating', field: 'creditRating', label: 'Credit Rating', icon: Star, tooltip: 'The customer\'s credit rating.', options: ['Fair', 'Excellent'] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-header-background/80 backdrop-blur-sm" style={{ backgroundColor: '#2563EB' }}>
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold text-white">Customer Purchase Prediction</h1>
      </header>
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Customer Details</h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Enter the customer's details to predict if they will buy a computer.
            </p>
          </div>
          <TooltipProvider>
            <Card className="bg-blue-50/20 dark:bg-blue-900/10 border-blue-200/50 shadow-sm">
              <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-center">
                <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                        src="https://t4.ftcdn.net/jpg/05/66/23/59/360_F_566235954_3pNPfH3SgvKkE1SIUgLdYpL22M1GZhrP.jpg"
                        alt="Customer with laptop"
                        width={400}
                        height={400}
                        data-ai-hint="customer shopping computer"
                        className="object-cover rounded-md"
                    />
                </div>
                <div className="space-y-6">
                  {customerInputs.map(
                    ({ id, field, label, icon: Icon, tooltip, options }) => (
                      <div key={id} className="flex items-start gap-4">
                        <div className="p-2.5 bg-background rounded-full border">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={id} className="font-semibold">
                              {label}
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button>
                                  <Info className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tooltip}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Select
                            value={conditions[field as keyof CustomerDetails]}
                            onValueChange={(value) => handleInputChange(field as keyof CustomerDetails, value)}
                          >
                            <SelectTrigger id={id} className="bg-background/80 capitalize">
                              <SelectValue placeholder={`Select ${label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((option) => (
                                <SelectItem key={option} value={option} className="capitalize">
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TooltipProvider>

          <div className="mt-8 space-y-4 max-w-sm mx-auto">
            <div className="grid gap-2 text-center">
              <Label htmlFor="num-trees">Number of Decision Trees: {numTrees}</Label>
              <Slider
                id="num-trees"
                min={3}
                max={15}
                step={1}
                value={[numTrees]}
                onValueChange={(value) => {
                  setNumTrees(value[0]);
                  reset();
                }}
                disabled={isPredicting}
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={handlePredict} disabled={!allFieldsFilled || isPredicting}>
              <Sparkles className="w-5 h-5 mr-2" />
              {isPredicting ? 'Analyzing...' : prediction ? 'Run New Prediction' : 'Predict'}
            </Button>
          </div>
        </div>

        {(isPredicting || prediction) && (
          <div className="flex flex-col items-center w-full mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {prediction ? 'Prediction Details' : 'Analyzing Customer Data...'}
            </h2>

            <div
              className={cn(
                'grid grid-cols-1 lg:grid-cols-3 gap-4 w-full transition-opacity duration-1000',
                isPredicting || prediction ? 'opacity-100' : 'opacity-0'
              )}
            >
              {[...Array(numTrees)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-center text-lg">Tree {i + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center p-4 min-h-[150px]">
                    <DecisionTree
                      conditions={conditionsForPrediction}
                      treeId={i + 1}
                      isActive={!!conditionsForPrediction}
                    />
                  </CardContent>
                  {prediction && treeResults.length > 0 && (
                    <CardFooter className="flex justify-center text-sm font-medium">
                      Prediction:{' '}
                      <span
                        className={cn('font-bold ml-1', {
                          'text-destructive': treeResults[i] === 'Don\'t Buy',
                          'text-green-500': treeResults[i] === 'Buy',
                        })}
                      >
                        {treeResults[i] || '...'}
                      </span>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>

            {prediction && (
              <>
                <Card className="mt-8 w-full max-w-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <Vote className="w-6 h-6" />
                      How the Final Prediction is Made
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-6 space-y-6">
                    <div className="flex items-center space-x-2 md:space-x-8 overflow-x-auto p-4 max-w-full">
                      {treeResults.map((result, index) => (
                        <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0">
                          <div
                            className={cn(
                              'w-16 h-16 rounded-full flex items-center justify-center text-center text-white font-bold shadow-lg p-1',
                               result === 'Don\'t Buy' ? 'bg-destructive text-xs' : 'bg-green-500 text-sm'
                            )}
                          >
                           {result}
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Tree {index + 1}
                          </span>
                           <span
                            className={cn('font-bold ml-1 text-sm', {
                              'text-destructive': result === 'Don\'t Buy',
                              'text-green-500': result === 'Buy',
                            })}
                          >
                            {result}
                          </span>
                        </div>
                      ))}
                    </div>

                     <ArrowDown className="w-12 h-12 text-muted-foreground" />

                    <div className="flex flex-col items-center space-y-2">
                       <div className="flex gap-4 items-center mb-4">
                        <div className="text-center">
                          <p className="font-bold text-lg text-destructive">{dontBuyVotes}</p>
                          <p className="text-sm text-muted-foreground">"Don't Buy" Votes</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg text-green-500">{buyVotes}</p>
                          <p className="text-sm text-muted-foreground">"Buy" Votes</p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-24 h-24 rounded-full flex items-center justify-center text-white font-bold shadow-xl text-center p-2',
                          prediction === 'Don\'t Buy' ? 'bg-destructive text-lg' : 'bg-green-500 text-xl'
                        )}
                      >
                       {prediction}
                      </div>
                      <span className="text-lg font-semibold">
                        Final Result:{' '}
                        <span
                          className={cn({
                            'text-destructive': prediction === 'Don\'t Buy',
                            'text-green-500': prediction === 'Buy',
                          })}
                        >
                          {prediction}
                        </span>
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-8 w-full max-w-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      Why Random Forest Works
                    </CardTitle>
                    <CardDescription>
                      The "Random Forest" method provides a more reliable prediction by combining multiple decision trees.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Multiple Perspectives</h3>
                      <p className="text-sm text-muted-foreground">
                        Each tree votes, providing a broader analysis than a single opinion.
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <BarChart className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Reduces Errors</h3>
                      <p className="text-sm text-muted-foreground">Averaging many trees cancels out individual errors.</p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Higher Accuracy</h3>
                      <p className="text-sm text-muted-foreground">
                        The collective decision is more accurate and reliable.
                      </p>
                    </div>
                  </CardContent>
                   <CardFooter>
                    <p
                      className={cn(
                        'w-full text-center font-semibold text-lg',
                        {
                          'text-destructive': prediction === 'Don\'t Buy',
                          'text-green-500': prediction === 'Buy',
                        }
                      )}
                    >
                      {prediction === 'Don\'t Buy'
                        ? 'This collective approach gives higher confidence in the "Don\'t Buy" prediction.'
                        : 'This collective approach gives higher confidence in the "Buy" prediction.'}
                    </p>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

    