
'use client';

import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles, Sun, Cloud, CloudRain, Thermometer, Wind } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type WeatherState = {
  outlook: string;
  temp: string;
  humidity: string;
  wind: string;
};

export default function TennisPredictionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherState>({
    outlook: '',
    temp: '',
    humidity: '',
    wind: '',
  });
  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<'Yes' | 'No' | null>(null);

  const handleSelectChange = (field: keyof WeatherState, value: string) => {
    setWeather((prev) => ({ ...prev, [field]: value }));
    setPrediction(null);
  };

  const handlePredict = () => {
    if (!weather.outlook || !weather.temp || !weather.humidity || !weather.wind) {
      toast({
        title: 'Missing Information',
        description: 'Please select a value for all weather conditions.',
        variant: 'destructive',
      });
      return;
    }
    setIsPredicting(true);
    setTimeout(() => {
      // Simplified prediction logic for demonstration
      if (weather.outlook === 'Overcast') {
        setPrediction('Yes');
      } else if (weather.outlook === 'Sunny' && weather.humidity === 'Normal') {
        setPrediction('Yes');
      } else if (weather.outlook === 'Rainy' && weather.wind === 'Weak') {
        setPrediction('Yes');
      } else {
        setPrediction('No');
      }
      setIsPredicting(false);
    }, 1000);
  };

  const weatherInputs = [
    { id: 'outlook', label: 'Outlook', icon: Sun, options: ['Sunny', 'Overcast', 'Rainy'] },
    { id: 'temp', label: 'Temperature', icon: Thermometer, options: ['Hot', 'Mild', 'Cool'] },
    { id: 'humidity', label: 'Humidity', icon: Cloud, options: ['High', 'Normal'] },
    { id: 'wind', label: 'Wind', icon: Wind, options: ['Strong', 'Weak'] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex items-center h-16 px-4 border-b bg-header-background/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="ml-4 text-xl font-semibold">Tennis Play Prediction</h1>
      </header>
      <main className="flex-1 p-4 md:p-6 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Weather Conditions
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Enter the weather conditions to predict if it's a good day for tennis.
            </p>
          </div>

          <Card className="bg-green-50/20 dark:bg-green-900/10 border-green-200/50 shadow-sm">
            <CardContent className="p-6 grid md:grid-cols-2 gap-8 items-center">
              <div className="relative w-full h-64 md:h-full rounded-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1551773691-69564a915136?q=80&w=1974&auto=format&fit=crop"
                  alt="Tennis Court"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                  data-ai-hint="tennis court"
                />
              </div>
              <div className="space-y-6">
                {weatherInputs.map(({ id, label, icon: Icon, options }) => (
                  <div key={id} className="flex items-start gap-4">
                    <div className="p-2.5 bg-background rounded-full border">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={id} className="font-semibold">
                        {label}
                      </Label>
                      <Select
                        onValueChange={(value) => handleSelectChange(id as keyof WeatherState, value)}
                        value={weather[id as keyof WeatherState]}
                      >
                        <SelectTrigger id={id} className="bg-background/80">
                          <SelectValue placeholder={`Select ${label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={handlePredict} disabled={isPredicting}>
              <Sparkles className="w-5 h-5 mr-2" />
              {isPredicting ? 'Analyzing...' : 'Predict'}
            </Button>
          </div>

          {prediction && !isPredicting && (
            <Card className="mt-8 w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">Prediction Result</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-6xl font-bold" style={{ color: prediction === 'Yes' ? 'hsl(var(--primary))' : 'hsl(var(--destructive))' }}>
                  {prediction}
                </p>
                <p className="text-muted-foreground mt-2">
                  {prediction === 'Yes' ? "It's a great day to play tennis!" : 'Maybe another day would be better for tennis.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
