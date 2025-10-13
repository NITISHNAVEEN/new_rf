'use client';

import { useState } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { getPredictionExplanation } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import type { Prediction, TaskType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ExplainPredictionProps {
  history: Prediction[];
  featureNames: string[];
  taskType: TaskType;
  isLoading: boolean;
}

export function ExplainPrediction({ history, featureNames, taskType, isLoading }: ExplainPredictionProps) {
  const [selectedPredictionId, setSelectedPredictionId] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isExplaining, setIsExplaining] = useState(false);
  const { toast } = useToast();

  const handleExplain = async () => {
    const prediction = history.find(p => p.id === selectedPredictionId);
    if (!prediction) return;
    
    setIsExplaining(true);
    setExplanation('');
    try {
      const result = await getPredictionExplanation({
        featureValues: prediction.features,
        prediction: prediction.prediction,
        featureNames,
        taskType,
      });
      setExplanation(result);
    } catch (error) {
      console.error('Failed to get explanation:', error);
      toast({
        title: 'Explanation Failed',
        description: 'Could not generate an explanation for this prediction.',
        variant: 'destructive',
      });
    } finally {
      setIsExplaining(false);
    }
  };

  const selectedPrediction = history.find(p => p.id === selectedPredictionId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Explain Prediction</CardTitle>
        <Bot className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading && !history.length ? (
            <Skeleton className="h-10 w-full" />
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" disabled={!history.length}>
                Explain a Prediction
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Get AI-Powered Explanation</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Select a prediction from the history to understand why the model made its decision.
                </p>
                <Select onValueChange={setSelectedPredictionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a prediction..." />
                  </SelectTrigger>
                  <SelectContent>
                    {history.map((p, i) => (
                      <SelectItem key={p.id} value={p.id}>
                        Prediction #{i + 1} (Predicted: {p.prediction}, Actual: {p.actual})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPrediction && (
                    <Button onClick={handleExplain} disabled={!selectedPredictionId || isExplaining}>
                        {isExplaining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Explain
                    </Button>
                )}
                {isExplaining && <Skeleton className="h-24 w-full" />}
                {explanation && (
                    <div className="mt-4 rounded-lg border bg-accent/50 p-4 text-sm">
                        {explanation}
                    </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
