'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Zap, HeartPulse, Activity, TestTube2, FlaskConical, Loader2, Info } from 'lucide-react';
import { useRandomForest } from '@/hooks/use-random-forest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Prediction, ForestSimulation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ForestVisualization } from '@/components/forest-visualization';

const predictionFeatures = ['Blood Pressure', 'Cholesterol', 'Heart Rate', 'Blood Sugar'];
const formSchema = z.object(
  predictionFeatures.reduce((acc, feature) => {
    acc[feature.replace(/\s+/g, '')] = z.string().refine(val => !isNaN(parseFloat(val)), { message: "Must be a number" });
    return acc;
  }, {} as Record<string, z.ZodType<any, any>>)
);
type FormValues = z.infer<typeof formSchema>;

export default function HeartAttackPredictionPage() {
  const { state, actions } = useRandomForest();
  const router = useRouter();
  const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [numTrees, setNumTrees] = useState(3);
  const [maxDepth, setMaxDepth] = useState(3);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      BloodPressure: '120',
      Cholesterol: '200',
      HeartRate: '75',
      BloodSugar: '99',
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsPredicting(true);
    setPredictionResult(null);

    // Await prediction result
    const result = await actions.predict(values as any, numTrees, maxDepth);
    setPredictionResult(result);

    setIsPredicting(false);
  };
  
  const inputFields = [
    { name: 'Blood Pressure', icon: Activity, placeholder: '120' },
    { name: 'Cholesterol', icon: TestTube2, placeholder: '200' },
    { name: 'Heart Rate', icon: HeartPulse, placeholder: '75' },
    { name: 'Blood Sugar', icon: FlaskConical, placeholder: '99' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-lg">
      <header className="flex items-center h-16 px-6 border-b bg-red-200 dark:bg-red-800/20 rounded-t-lg">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="ml-4 text-xl font-semibold">Heart Attack Prediction</h2>
      </header>
      <main className="flex-1 p-6 md:p-10 flex flex-col items-center space-y-8">
        <>
          <h1 className="text-3xl font-bold tracking-tight">Patient Vitals Input</h1>
          <p className="mt-2 text-muted-foreground">Enter the patient's vitals to predict the risk of a heart attack.</p>
        </>

        <Card className={cn("w-full max-w-4xl p-6")}>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative w-full h-64 md:h-full rounded-lg overflow-hidden">
              <Image
                src="https://images.medicinenet.com/images/article/main_image/circulatory-system-pulmonary-hypertension-heart-illustration-rendering.jpg?output-quality=75"
                alt="Heart Illustration"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {inputFields.map(({ name, icon: Icon, placeholder }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name.replace(/\s+/g, '') as any}
                    render={({ field }) => (
                      <FormItem>
                        <TooltipProvider>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <FormLabel>{name}</FormLabel>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter the {name.toLowerCase()} value.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                        <FormControl>
                          <Input placeholder={placeholder} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </form>
            </Form>
          </div>
        </Card>
        <div className={cn("w-full max-w-xl space-y-4")}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Number of Decision Trees</Label>
                <span className="text-sm text-muted-foreground">{numTrees}</span>
              </div>
              <Slider
                value={[numTrees]}
                onValueChange={(value) => setNumTrees(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Max Depth</Label>
                <span className="text-sm text-muted-foreground">{maxDepth}</span>
              </div>
              <Slider
                value={[maxDepth]}
                onValueChange={(value) => setMaxDepth(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={form.handleSubmit(onSubmit)} disabled={isPredicting}>
            {isPredicting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            {isPredicting ? 'Predicting...' : 'Predict'}
          </Button>
        </div>

        {isPredicting && (
          <div className="w-full max-w-4xl mt-12 text-center">
            <p className="text-muted-foreground mb-4">Feeding patient data to the Random Forest model...</p>
            <div className="flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          </div>
        )}

        {predictionResult && (
          <div className="w-full max-w-6xl space-y-8">
            <ForestVisualization
              simulationData={predictionResult.forestSimulation}
              taskType={state.task}
              isLoading={isPredicting}
              onRetrain={() => { }}
              datasetName={"synthetic-patient-data"}
              description="The Random Forest below is made of multiple decision trees. Each tree makes its own prediction, and the final result is determined by a majority vote."
            />
            <div className="mt-8 p-4 bg-background rounded-lg border text-center">
              <p className="text-4xl font-bold">
                Final Prediction: <span className={cn(predictionResult.prediction === 1 ? 'text-green-600' : 'text-red-600')}>
                  {predictionResult.prediction === 1 ? 'Risk Less' : 'Risky'}
                </span>
              </p>
              <p className="text-muted-foreground mt-2">Based on the majority vote from all decision trees.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
