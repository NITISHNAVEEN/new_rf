
'use client';

import { useRouter } from 'next/navigation';
import { useRandomForest } from '@/hooks/use-random-forest';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, ArrowLeft, Database, FlaskConical, Trees, ArrowRight, FileText, GitMerge, TestTube2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import customerPurchaseData from '@/lib/data/customer-purchase-data.json';
import { useEffect } from 'react';


export default function CustomerPurchaseDataPage() {
    const router = useRouter();
    const { actions } = useRandomForest();

    useEffect(() => {
        actions.setDataset('customer-purchase');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const testingDataIndices = [2, 5, 8, 11]; // Example indices for testing data

    return (
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900/50 rounded-lg">
        <header className="flex items-center h-16 px-6 border-b bg-blue-200 dark:bg-blue-800/20 rounded-t-lg">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="ml-4 text-xl font-semibold">Customer Purchase Dataset</h2>
        </header>
        <main className="flex-1 p-6 md:p-10 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Customer Data</CardTitle>
              <CardDescription>This is the complete dataset used to train and test our prediction model.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Age</TableHead>
                    <TableHead>Income</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Credit Rating</TableHead>
                    <TableHead>Buys Computer?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerPurchaseData.map((customer, index) => (
                    <TableRow key={index} className={cn(testingDataIndices.includes(index) && "bg-blue-100 dark:bg-blue-900/30")}>
                      <TableCell>{customer.Age}</TableCell>
                      <TableCell>{customer.Income}</TableCell>
                      <TableCell>{customer.Student}</TableCell>
                      <TableCell>{customer['Credit Rating']}</TableCell>
                      <TableCell>
                        <Badge variant={customer['Buys Computer?'] === 'No' ? 'destructive' : 'default'} className={customer['Buys Computer?'] === 'Yes' ? 'bg-green-500' : ''}>
                          {customer['Buys Computer?']}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
                <CardTitle>How the Model is Trained</CardTitle>
                <CardDescription>The model learns from customer data using a process called "supervised learning".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <FlaskConical className="h-5 w-5 text-primary"/>
                        <h3 className="text-lg font-semibold">Step 1: Train-Test Split</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">The dataset is split into two parts: a larger <span className="font-semibold text-foreground">Training Set</span> to teach the model, and a smaller <span className="font-semibold text-foreground">Testing Set</span> to evaluate its accuracy. The blue rows in the table above represent the testing data.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
                        <div className="p-4 border rounded-lg flex flex-col items-center gap-2">
                            <FileText className="h-8 w-8"/>
                            <p className="font-semibold">Full Dataset</p>
                            <p className="text-sm text-muted-foreground">14 records</p>
                        </div>
                        <ArrowRight className="h-8 w-8 text-muted-foreground hidden sm:block"/>
                        <div className="flex gap-4">
                            <div className="p-4 border rounded-lg flex flex-col items-center gap-2 bg-blue-50 dark:bg-blue-900/20">
                                <BrainCircuit className="h-8 w-8 text-blue-600"/>
                                <p className="font-semibold">Training Set</p>
                                <p className="text-sm text-muted-foreground">10 records</p>
                            </div>
                            <div className="p-4 border rounded-lg flex flex-col items-center gap-2 bg-green-50 dark:bg-green-900/20">
                                <TestTube2 className="h-8 w-8 text-green-600"/>
                                <p className="font-semibold">Testing Set</p>
                                <p className="text-sm text-muted-foreground">4 records</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <GitMerge className="h-5 w-5 text-primary"/>
                        <h3 className="text-lg font-semibold">Step 2: Training the Random Forest</h3>
                    </div>
                    <p className="text-muted-foreground mb-4">The model is a <span className="font-semibold text-foreground">Random Forest</span>, which is a collection of many individual Decision Trees. Each tree is trained on a random subset of the training data and features (like Age, Income, etc.). When making a prediction, all trees "vote", and the majority outcome becomes the final prediction. This makes the model more accurate and robust for deciding whether a customer will buy a computer.</p>
                     <div className="flex items-center justify-center gap-8 text-center">
                        <div className="flex flex-col items-center gap-1">
                            <Trees className="h-10 w-10 text-primary"/>
                            <p className="text-sm">Tree 1</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Trees className="h-10 w-10 text-primary"/>
                            <p className="text-sm">Tree 2</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <Trees className="h-10 w-10 text-primary"/>
                            <p className="text-sm">Tree 3</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-2xl font-bold">...</p>
                            <p className="text-sm text-muted-foreground">Many Trees</p>
                        </div>
                    </div>
                </div>
                 <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    router.push('/dashboard/customer-purchase-prediction');
                  }}
                >
                  Explore Decision Trees & Predict
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

    