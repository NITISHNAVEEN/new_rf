
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
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Sparkles,
  HeartCrack,
  HeartPulse,
  ArrowDown,
  Vote,
  Users,
  ShieldCheck,
  BarChart,
  Info,
  Droplets,
  Activity,
  GlassWater,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

type Vitals = {
  bloodPressure: string;
  cholesterol: string;
  heartRate: string;
  bloodSugar: string;
};

type TreeNodeProps = {
  condition: string;
  isPath?: boolean;
  isLeaf?: boolean;
  result?: 'Risky' | 'Not Risky';
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
            isLeaf && result === 'Risky' && isPath,
          'border-green-500 bg-green-500/10':
            isLeaf && result === 'Not Risky' && isPath,
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
  vitals: Vitals | null;
  treeId: number;
  isActive: boolean;
};

const DecisionTree = ({ vitals, treeId, isActive }: DecisionTreeProps) => {
  const [paths, setPaths] = React.useState<string[]>([]);
  const seed = treeId;
  const vitalOptions = ['bp', 'chol', 'hr', 'bs'];
  const op1 = vitalOptions[seed % 4];
  const op2 = vitalOptions[(seed + 1) % 4];
  const op3 = vitalOptions[(seed + 2) % 4];

  React.useEffect(() => {
    if (isActive && vitals) {
      const { bloodPressure, cholesterol, heartRate, bloodSugar } = vitals;
      const bpSys = parseInt(bloodPressure);
      const chol = parseInt(cholesterol);
      const hr = parseInt(heartRate);
      const bs = parseInt(bloodSugar);
      let currentPath: string[] = [];

      const thresholds = {
        bp: 120 + (seed * 5) % 40,
        chol: 200 + (seed * 7) % 50,
        hr: 70 + (seed * 3) % 25,
        bs: 90 + (seed * 4) % 30,
      };

      const getVital = (op: string) => {
        if (op === 'bp') return bpSys;
        if (op === 'chol') return chol;
        if (op === 'hr') return hr;
        return bs;
      };

      currentPath.push('root');
      if (getVital(op1) > thresholds[op1 as keyof typeof thresholds]) {
        currentPath.push(`${op1}>`);
        if (getVital(op2) > thresholds[op2 as keyof typeof thresholds]) {
          currentPath.push(`${op1}>_${op2}>`);
        } else {
          currentPath.push(`${op1}>_${op2}<=`);
        }
      } else {
        currentPath.push(`${op1}<=`);
        if (getVital(op3) > thresholds[op3 as keyof typeof thresholds]) {
          currentPath.push(`${op1}<=_${op3}>`);
        } else {
          currentPath.push(`${op1}<=_${op3}<=`);
        }
      }

      setPaths(currentPath);
    } else if (!isActive) {
      setPaths([]);
    }
  }, [isActive, vitals, treeId, op1, op2, op3, seed]);

  const isPath = (id: string) => isActive && paths.includes(id);

  // Generic tree structure generation
  const vitalNames: { [key: string]: string } = {
    bp: 'Blood Pressure',
    chol: 'Cholesterol',
    hr: 'Heart Rate',
    bs: 'Blood Sugar',
  };

  const thresholds = {
    bp: 120 + (seed * 5) % 40,
    chol: 200 + (seed * 7) % 50,
    hr: 70 + (seed * 3) % 25,
    bs: 90 + (seed * 4) % 30,
  };

  const getResult = (pathSeed: number) =>
    pathSeed % 3 === 0 ? 'Not Risky' : 'Risky';

  return (
    <TreeNode
      condition={`${vitalNames[op1]} > ${
        thresholds[op1 as keyof typeof thresholds]
      }?`}
      isPath={isPath('root')}
    >
      <div className="flex flex-col items-center">
        <span className="text-xs mb-1 absolute -top-4">Yes</span>

        <TreeNode
          condition={`${vitalNames[op2]} > ${
            thresholds[op2 as keyof typeof thresholds]
          }?`}
          isPath={isPath(`${op1}>`)}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">Yes</span>

            <TreeNode
              isLeaf
              result={getResult(seed + 1)}
              isPath={isPath(`${op1}>_${op2}>`)}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">No</span>

            <TreeNode
              isLeaf
              result={getResult(seed + 2)}
              isPath={isPath(`${op1}>_${op2}<=`)}
            />
          </div>
        </TreeNode>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-xs mb-1 absolute -top-4">No</span>

        <TreeNode
          condition={`${vitalNames[op3]} > ${
            thresholds[op3 as keyof typeof thresholds]
          }?`}
          isPath={isPath(`${op1}<=`)}
        >
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">Yes</span>

            <TreeNode
              isLeaf
              result={getResult(seed + 3)}
              isPath={isPath(`${op1}<=_${op3}>`)}
            />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs mb-1 absolute -top-4">No</span>

            <TreeNode
              isLeaf
              result={getResult(seed + 4)}
              isPath={isPath(`${op1}<=_${op3}<=`)}
            />
          </div>
        </TreeNode>
      </div>
    </TreeNode>
  );
};

export default function PredictPage() {
  const router = useRouter();
  const [vitals, setVitals] = React.useState<Vitals>({
    bloodPressure: '120',
    cholesterol: '200',
    heartRate: '75',
    bloodSugar: '99',
  });
  const [vitalsForPrediction, setVitalsForPrediction] =
    React.useState<Vitals | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isPredicting, setIsPredicting] = React.useState(false);
  const [prediction, setPrediction] = React.useState<
    'Risky' | 'Not Risky' | null
  >(null);
  const [treeResults, setTreeResults] = React.useState<
    ('Risky' | 'Not Risky')[]
  >([]);
  const [numTrees, setNumTrees] = useState(3);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleInputChange = (field: keyof Vitals, value: string) => {
    setVitals((prev) => ({ ...prev, [field]: value }));
    reset();
  };

  const handlePredict = () => {
    setIsPredicting(true);
    setVitalsForPrediction(vitals);
  };

  React.useEffect(() => {
    if (isPredicting && vitalsForPrediction) {
      const timeoutId = setTimeout(() => {
        const results: ('Risky' | 'Not Risky')[] = [];
        const { bloodPressure, cholesterol, heartRate, bloodSugar } =
          vitalsForPrediction;
        const bpSys = parseInt(bloodPressure);
        const chol = parseInt(cholesterol);
        const hr = parseInt(heartRate);
        const bs = parseInt(bloodSugar);

        for (let i = 1; i <= numTrees; i++) {
          const seed = i;
          const vitalOptions = ['bp', 'chol', 'hr', 'bs'];
          const op1 = vitalOptions[seed % 4];
          const op2 = vitalOptions[(seed + 1) % 4];
          const op3 = vitalOptions[(seed + 2) % 4];

          const thresholds = {
            bp: 120 + (seed * 5) % 40,
            chol: 200 + (seed * 7) % 50,
            hr: 70 + (seed * 3) % 25,
            bs: 90 + (seed * 4) % 30,
          };

          const getVital = (op: string) => {
            if (op === 'bp') return bpSys;
            if (op === 'chol') return chol;
            if (op === 'hr') return hr;
            return bs;
          };

          const getResult = (pathSeed: number) =>
            pathSeed % 3 === 0 ? 'Not Risky' : 'Risky';

          let result: 'Risky' | 'Not Risky';
          if (getVital(op1) > thresholds[op1 as keyof typeof thresholds]) {
            if (getVital(op2) > thresholds[op2 as keyof typeof thresholds]) {
              result = getResult(seed + 1);
            } else {
              result = getResult(seed + 2);
            }
          } else {
            if (getVital(op3) > thresholds[op3 as keyof typeof thresholds]) {
              result = getResult(seed + 3);
            } else {
              result = getResult(seed + 4);
            }
          }
          results.push(result);
        }

        setTreeResults(results);

        const riskyCount = results.filter((r) => r === 'Risky').length;
        const finalPrediction =
          riskyCount >= numTrees / 2 ? 'Risky' : 'Not Risky';

        setPrediction(finalPrediction);
        setIsPredicting(false);
      }, 1500); // Wait for animations to play

      return () => clearTimeout(timeoutId);
    }
  }, [isPredicting, vitalsForPrediction, numTrees]);

  const reset = () => {
    setPrediction(null);
    setTreeResults([]);
    setVitalsForPrediction(null);
  };

  const allFieldsFilled =
    vitals.bloodPressure &&
    vitals.cholesterol &&
    vitals.heartRate &&
    vitals.bloodSugar;

  if (!isMounted) {
    return null;
  }

  const riskyVotes = prediction
    ? treeResults.filter((r) => r === 'Risky').length
    : 0;
  const notRiskyVotes = prediction ? treeResults.length - riskyVotes : 0;

  const vitalInputs = [
    {
      id: 'bp',
      field: 'bloodPressure',
      label: 'Blood Pressure',
      icon: Activity,
      tooltip: 'The pressure of circulating blood on the artery walls.',
      placeholder: 'e.g. 120',
    },
    {
      id: 'chol',
      field: 'cholesterol',
      label: 'Cholesterol',
      icon: Droplets,
      tooltip: 'A waxy substance found in your blood.',
      placeholder: 'e.g. 200',
    },
    {
      id: 'hr',
      field: 'heartRate',
      label: 'Heart Rate',
      icon: HeartPulse,
      tooltip: 'The number of times the heart beats per minute.',
      placeholder: 'e.g. 75',
    },
    {
      id: 'bs',
      field: 'bloodSugar',
      label: 'Blood Sugar',
      icon: GlassWater,
      tooltip: 'The concentration of glucose in the blood.',
      placeholder: 'e.g. 99',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-header-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">
          Heart Attack Prediction
        </h1>
      </header>
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Patient Vitals Input
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Enter the patient's vitals to predict the risk of a heart attack.
            </p>
          </div>
          <TooltipProvider>
            <Card className="bg-yellow-50/20 dark:bg-yellow-900/10 border-yellow-200/50 shadow-sm">
              <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-center">
                <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
                  <Image
                    src="https://images.medicinenet.com/images/article/main_image/circulatory-system-pulmonary-hypertension-heart-illustration-rendering.jpg?output-quality=75"
                    alt="Human Body"
                    width={400}
                    height={400}
                    data-ai-hint="human body scan"
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="space-y-6">
                  {vitalInputs.map(
                    ({ id, field, label, icon: Icon, tooltip, placeholder }) => (
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
                          <Input
                            id={id}
                            value={vitals[field as keyof Vitals]}
                            onChange={(e) =>
                              handleInputChange(
                                field as keyof Vitals,
                                e.target.value
                              )
                            }
                            placeholder={placeholder}
                            className="bg-background/80"
                          />
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
              <Label htmlFor="num-trees">
                Number of Decision Trees: {numTrees}
              </Label>
              <Slider
                id="num-trees"
                min={3}
                max={30}
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
            <Button
              size="lg"
              onClick={handlePredict}
              disabled={!allFieldsFilled || isPredicting}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              {isPredicting
                ? 'Analyzing...'
                : prediction
                ? 'Run New Prediction'
                : 'Predict'}
            </Button>
          </div>
        </div>

        {(isPredicting || prediction) && (
          <div className="flex flex-col items-center w-full mt-8">
            <h2 className="text-2xl font-bold mb-4">
              {prediction ? 'Prediction Details' : 'Analyzing Patient Data...'}
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
                    <CardTitle className="text-center text-lg">
                      Tree {i + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-center p-4 min-h-[150px]">
                    <DecisionTree
                      vitals={vitalsForPrediction}
                      treeId={i + 1}
                      isActive={!!vitalsForPrediction}
                    />
                  </CardContent>
                  {prediction && treeResults.length > 0 && (
                    <CardFooter className="flex justify-center text-sm font-medium">
                      Prediction:{' '}
                      <span
                        className={cn('font-bold ml-1', {
                          'text-destructive': treeResults[i] === 'Risky',
                          'text-green-500': treeResults[i] === 'Not Risky',
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
                        <div
                          key={index}
                          className="flex flex-col items-center space-y-2 flex-shrink-0"
                        >
                          <div
                            className={cn(
                              'w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg',
                              result === 'Risky'
                                ? 'bg-destructive'
                                : 'bg-green-500'
                            )}
                          >
                            {result === 'Risky' ? (
                              <HeartCrack className="w-8 h-8" />
                            ) : (
                              <HeartPulse className="w-8 h-8" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-muted-foreground">
                            Tree {index + 1}
                          </span>
                          <span
                            className={cn('font-bold ml-1 text-sm', {
                              'text-destructive': result === 'Risky',
                              'text-green-500': result === 'Not Risky',
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
                          <p className="font-bold text-lg text-destructive">
                            {riskyVotes}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Risky Votes
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg text-green-500">
                            {notRiskyVotes}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Not Risky Votes
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          'w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl text-center p-2',
                          prediction === 'Risky'
                            ? 'bg-destructive'
                            : 'bg-green-500'
                        )}
                      >
                        {prediction}
                      </div>
                      <span className="text-lg font-semibold">
                        Final Result:{' '}
                        <span
                          className={cn({
                            'text-destructive': prediction === 'Risky',
                            'text-green-500': prediction === 'Not Risky',
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
                      The "Random Forest" method provides a more reliable
                      prediction by combining multiple decision trees.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Multiple Perspectives</h3>
                      <p className="text-sm text-muted-foreground">
                        Each tree votes, providing a broader analysis than a
                        single opinion.
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <BarChart className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Reduces Errors</h3>
                      <p className="text-sm text-muted-foreground">
                        Averaging many trees cancels out individual errors.
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <div className="p-3 rounded-full bg-primary/10">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold">Higher Accuracy</h3>
                      <p className="text-sm text-muted-foreground">
                        The collective decision is more accurate and reliable,
                        leading to better patient outcomes.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p
                      className={cn(
                        'w-full text-center font-semibold text-lg',
                        {
                          'text-destructive': prediction === 'Risky',
                          'text-green-500': prediction === 'Not Risky',
                        }
                      )}
                    >
                      {prediction === 'Risky'
                        ? 'This collective approach gives higher confidence in the "Risky" prediction.'
                        : 'This collective approach confirms the patient is likely not at immediate risk.'}
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
